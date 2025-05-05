import { toRaw } from 'vue';

import { type Arith, type Context, init, type Solver } from 'z3-solver';

import type { Ban, Fair } from './param';

export class Z3Solver {
  private static ctx: Context<'main'> | null = null;
  private solver: Solver | null = null;
  private grids: Arith<'main'>[] | null = null;

  async init() {
    if (Z3Solver.ctx != null) return Z3Solver.ctx;
    const { Context } = await init();
    // @ts-expect-error 'new' expression, whose target lacks a construct signature, implicitly has an 'any' type.ts(7009)
    Z3Solver.ctx = new Context('main') as Context<'main'>;
    return Z3Solver.ctx;
  }

  constructor(
    private days: number,
    private ban: Ban[],
    private fair: Fair[],
  ) {}

  async solve() {
    const ctx = await this.init();

    const grids = Array.from({ length: this.days }, (_, i) => ctx.Int.const(`cell_${i}`));
    this.grids = grids;

    this.solver = new ctx.Solver();
    const solver = this.solver;

    // No two consecutive grids have the same value
    grids.reduce((l, r) => {
      solver.add(l.neq(r));
      return r;
    });

    // Each grid has some forbidden numbers
    grids.forEach((grid, date) => {
      const ok = this.ban
        .map(({ dates }, i) => (dates.includes(date) ? null : i))
        .filter((v) => v != null);
      solver.add(ctx.Or(...ok.map((person) => grid.eq(ctx.ToInt(person)))));
    });

    // Each subset must have approximately equal number of each value (difference ≤ 1)
    this.fair.forEach(({ dates, diff }, uid) => {
      const counts = this.ban.map((_, person) => {
        const sum = ctx.Int.const(`count_${uid}_${person}`);
        const total = dates
          .filter((d) => grids[d] != null)
          .map((i) => ctx.If(grids[i]!.eq(ctx.ToInt(person)), ctx.ToInt(1), ctx.ToInt(0)))
          .reduce((acc, cond) => acc.add(cond), ctx.ToInt(0));
        solver.add(sum.eq(total));
        return sum;
      });

      for (let p1 = 0; p1 < counts.length; p1++) {
        for (let p2 = p1 + 1; p2 < counts.length; p2++) {
          const s = counts[p1]!.sub(counts[p2]!);
          solver.add(s.ge(ctx.ToInt(-diff)).and(s.le(ctx.ToInt(diff))));
        }
      }
    });
  }

  // Solve and print results
  async findSolutions() {
    const grids = toRaw(this.grids);
    if (this.solver == null || grids == null) return null;

    const res = await this.solver.check();
    if (res !== 'sat') return undefined;

    const model = this.solver.model();
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const result = grids.map((c) => Number(model.get(c).toString()));

    // Add constraint to exclude current solution
    const constraints = grids.map((c) => c.neq(model.get(c)));
    this.solver.add(Z3Solver.ctx!.Or(...constraints));

    return result;
  }
}
