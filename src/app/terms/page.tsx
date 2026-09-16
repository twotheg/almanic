export default function TermsPage() {
  return (
    <main className="px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-white">이용약관</h1>
      <p className="mb-8 text-slate-400">최종 수정일: {new Date().getFullYear()}년</p>

      <div className="space-y-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">1. 약관 동의</h2>
          <p>
            본 서비스에 접속하거나 이용하는 경우 본 이용약관에 동의하는 것으로
            간주됩니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">2. 서비스 이용</h2>
          <p>
            본 서비스는 개인적인 비상업적 용도로 이용할 수 있으며, 관련 법령과
            본 약관을 준수해야 합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">3. 지식재산권</h2>
          <p>
            본 서비스의 디자인, 로고, 텍스트, 이미지, 소프트웨어 등은 관련
            법령에 따라 보호받습니다. 사전 동의 없이 무단 복제·배포·판매할 수
            없습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">4. 광고</h2>
          <p>
            본 서비스는 Google AdSense, Google AdMob 등을 통해 광고를 게재할 수
            있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">5. 책임의 한계</h2>
          <p>
            기술적 문제, 천재지변, 제3자 서비스 장애 등으로 인한 일시적 중단에
            대해서는 책임을 지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">6. 문의</h2>
          <p>문의: support@almanic.vercel.app</p>
        </section>
      </div>
    </main>
  );
}
