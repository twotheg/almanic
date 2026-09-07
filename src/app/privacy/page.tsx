export const metadata = {
  title: "개인정보처리방침 - 블럭 매칭 게임",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10 text-slate-200">
      <h1 className="text-2xl font-bold text-white">개인정보처리방침</h1>
      <p className="mt-2 text-sm text-slate-400">블럭 매칭 게임 (Block Matching Game)</p>

      <section className="mt-8 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-white">1. 수집하는 정보</h2>
        <p>
          본 앱은 회원가입 없이 이용할 수 있으며, 다음의 정보만 최소한으로
          처리합니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>게임 진행 상황(클리어한 스테이지, 기록 시간) — 기기 및 서버에 저장</li>
          <li>푸시 알림 구독 정보(알림 허용 시 브라우저가 제공하는 구독 토큰)</li>
          <li>익명 기기 식별자(진행 상황 저장용, 개인을 식별할 수 없음)</li>
        </ul>

        <h2 className="text-lg font-semibold text-white">2. 이용 목적</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>게임 진행 상황 복구 및 기기 간 동기화</li>
          <li>사용자가 허용한 경우 리마인더 푸시 알림 전송</li>
        </ul>

        <h2 className="text-lg font-semibold text-white">3. 제3자 제공</h2>
        <p>
          수집된 정보는 제3자에게 판매하거나 제공하지 않습니다. 단, 푸시 알림
          전송을 위해 브라우저의 푸시 서비스(예: Google FCM)를 이용합니다.
        </p>

        <h2 className="text-lg font-semibold text-white">4. 광고</h2>
        <p>
          앱 내에는 배너 및 보상형 광고가 표시될 수 있습니다. 광고 제공 과정에서
          광고 네트워크가 자체 정책에 따라 광고 식별자를 처리할 수 있습니다.
        </p>

        <h2 className="text-lg font-semibold text-white">5. 데이터 삭제</h2>
        <p>
          브라우저의 사이트 데이터 삭제 또는 앱 제거로 기기의 모든 데이터를
          직접 삭제할 수 있습니다.
        </p>

        <h2 className="text-lg font-semibold text-white">6. 아동 개인정보</h2>
        <p>본 앱은 아동의 개인정보를 고의로 수집하지 않습니다.</p>

        <h2 className="text-lg font-semibold text-white">7. 문의</h2>
        <p>
          개인정보 관련 문의:{" "}
          <span className="font-semibold text-white">twotheg@gmail.com</span>
        </p>
      </section>
    </main>
  );
}
