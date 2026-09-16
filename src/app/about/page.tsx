import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-white">블록 매칭 게임 소개</h1>

      <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-3 text-xl font-semibold text-white">어떤 게임인가요?</h2>
        <p className="leading-relaxed text-slate-300">
          블록 매칭 게임은 전통적인 Shikaku(사각형 나누기) 퍼즐을 현대적으로
          재해석한 모바일 게임입니다. 격자판에 있는 숫자만큼 칸을 차지하는
          직사각형 영역을 그려 전체 판을 채우는 것이 목표입니다.
        </p>
      </section>

      <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-3 text-xl font-semibold text-white">주요 특징</h2>
        <ul className="list-inside list-disc space-y-2 text-slate-300">
          <li>직관적인 터치 조작</li>
          <li>Easy / Medium / Hard 3가지 난이도</li>
          <li>500개 이상의 다양한 레벨</li>
          <li>힌트 시스템과 타이머 기능</li>
          <li>오프라인에서도 플레이 가능</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-3 text-xl font-semibold text-white">더 알아보기</h2>
        <p className="mb-4 text-slate-300">
          게임 규칙과 공략은 아래 링크에서 확인하세요.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/how-to-play"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            게임 방법
          </Link>
          <Link
            href="/tips"
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
          >
            팁과 공략
          </Link>
        </div>
      </section>
    </main>
  );
}
