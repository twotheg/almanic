export default function HowToPlayPage() {
  return (
    <main className="px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-white">게임 방법</h1>

      <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-3 text-xl font-semibold text-white">기본 목표</h2>
        <p className="leading-relaxed text-slate-300">
          격자판 전체를 여러 개의 직사각형(또는 정사각형) 영역으로 나눕니다.
          각 영역 안에는 숫자가 딱 하나만 포함되어야 하며, 영역의 칸 수는
          해당 숫자와 일치해야 합니다.
        </p>
      </section>

      <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">핵심 규칙</h2>
        <div className="space-y-4 text-slate-300">
          <div>
            <h3 className="font-medium text-white">1. 숫자와 영역</h3>
            <p>각 영역 안에는 반드시 숫자가 딱 하나만 포함되어야 합니다.</p>
          </div>
          <div>
            <h3 className="font-medium text-white">2. 넓이 일치</h3>
            <p>
              영역 안의 숫자는 그 직사각형이 차지하는 칸의 수를 의미합니다.
              예: 10은 2×5 또는 5×2, 16은 4×4 또는 2×8 등이 될 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-white">3. 중복 및 빈칸 금지</h3>
            <p>영역끼리 겹쳐서는 안 되고, 모든 칸은 반드시 채워져야 합니다.</p>
          </div>
          <div>
            <h3 className="font-medium text-white">4. 모양 제한</h3>
            <p>직사각형 또는 정사각형만 허용됩니다. L자나 T자는 불가능합니다.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-3 text-xl font-semibold text-white">클리어 조건</h2>
        <p className="text-slate-300">
          게임판의 모든 칸이 적절한 직사각형 영역으로 채워지면 클리어입니다.
          난이도가 올라갈수록 격자판이 커지고 숫자 배치가 복잡해집니다.
        </p>
      </section>
    </main>
  );
}
