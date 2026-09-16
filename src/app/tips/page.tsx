export default function TipsPage() {
  return (
    <main className="px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-white">팁과 공략</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {[
          {
            title: "큰 숫자부터 처리하기",
            desc: "큰 숫자는 배치 가능한 위치가 제한적입니다. 먼저 확정지으면 나머지가 쉬워집니다.",
          },
          {
            title: "모서리와 가장자리 활용하기",
            desc: "모서리 숫자는 벽에 붙을 가능성이 높습니다. 가장자리를 먼저 채워보세요.",
          },
          {
            title: "힌트는 아껴 쓰기",
            desc: "정말 막혔을 때만 사용하세요. 스스로 풀수록 두뇌 용동 효과가 큽니다.",
          },
          {
            title: "시간에 쫓기지 않기",
            desc: "속도보다 정확성이 중요합니다. 천천히 가능한 영역을 확인하세요.",
          },
          {
            title: "고립된 숫자 찾기",
            desc: "주변 숫자가 적은 칸은 배치 가능한 영역이 한정되어 있습니다.",
          },
          {
            title: "되돌리기 적극 활용",
            desc: "틀어진 영역은 즉시 지우고 다시 시작하세요. 주변에 영향을 많이 줍니다.",
          },
        ].map((tip, idx) => (
          <section
            key={idx}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <h2 className="mb-2 text-lg font-semibold text-white">{tip.title}</h2>
            <p className="text-slate-300">{tip.desc}</p>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-3 text-xl font-semibold text-white">난이도별 공략</h2>
        <div className="space-y-3 text-slate-300">
          <p>
            <strong className="text-white">Easy:</strong> 기본 규칙에 익숙해지는
            단계입니다. 천천히 모든 규칙을 확인하며 풀어보세요.
          </p>
          <p>
            <strong className="text-white">Medium:</strong> 큰 숫자부터 확정짓고
            모서리를 먼저 채우는 전략이 유효합니다.
          </p>
          <p>
            <strong className="text-white">Hard:</strong> 전체 흐름을 먼저
            파악한 뒤 세부 영역을 조금씩 채워 나가세요.
          </p>
        </div>
      </section>
    </main>
  );
}
