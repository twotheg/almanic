export const metadata = {
  title: "개인정보처리방침 - 블록 매칭 게임",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-slate-200">
      <h1 className="text-3xl font-bold text-white mb-2">개인정보처리방침 (Privacy Policy)</h1>
      <p className="text-sm text-slate-400 mb-8">블록 매칭 게임 (Block Matching Game) / 시행일자: 2026년 10월</p>

      <section className="space-y-6 text-sm leading-relaxed text-slate-300">
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">1. 수집하는 개인정보의 항목 및 수집 방법</h2>
          <p className="mb-2">
            본 "블록 매칭 게임" 앱(이하 "서비스")은 별도의 회원가입 절차 없이 누구나 즉시 이용할 수 있으며, 서비스 제공을 위해 사용자 본인을 식별할 수 있는 민감한 개인정보(이름, 주민등록번호, 연락처 등)를 일체 수집하거나 요구하지 않습니다. 다만, 서비스의 원활한 이용과 품질 향상을 위해 과정에서 아래와 같은 정보가 자동으로 생성되어 수집될 수 있습니다.
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>서비스 이용 기록: 게임 진행 상황(클리어한 스테이지, 기록 시간, 달성도 등)이 사용자의 기기 로컬 스토리지 및 당사 서버에 비식별화되어 저장됩니다.</li>
            <li>기기 정보 및 알림: 푸시 알림 구독 정보(알림 허용 시 브라우저가 제공하는 구독 토큰) 및 익명 기기 식별자(진행 상황 저장용)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">2. 개인정보의 수집 및 이용 목적</h2>
          <p className="mb-2">수집된 최소한의 자동 생성 정보는 오직 다음의 목적을 위해서만 한정적으로 활용됩니다.</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>사용자의 게임 진행 상태 복구, 진척도 유지 및 기기 간 원활한 동기화 환경 제공</li>
            <li>사용자가 명시적으로 허용한 경우에 한하여 업데이트 안내 및 리마인더 푸시 알림 전송</li>
            <li>서비스의 안정성 확보, 오류 분석 및 사용자 환경 최적화를 위한 통계 지표 산출</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">3. 개인정보의 제3자 제공 및 외부 서비스 연동</h2>
          <p className="mb-2">
            본 서비스는 수집된 사용자 정보를 원칙적으로 외부에 제공하거나 제3자에게 판매하지 않습니다. 단, 무료 서비스의 원활한 유지 및 특정 기능 구현을 위해 불가피하게 다음의 신뢰할 수 있는 글로벌 제3자 서비스를 연동하여 이용하고 있습니다.
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>푸시 알림 전송 기술 지원: 브라우저의 웹 푸시 서비스 (예: Google FCM)</li>
            <li>인프라 및 호스팅 운영: Vercel Cloud 플랫폼</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">4. 맞춤형 광고 게재 (Google AdSense / AdMob)</h2>
          <p className="mb-2">
            본 서비스는 사용자에게 지속적으로 무료 게임 환경을 제공하기 위하여 앱 내에 배너 및 보상형 팝업 형태의 광고를 표시하고 있습니다. 이를 위해 당사는 Google AdSense 등 외부 광고 네트워크 파트너와 협력하고 있습니다.
          </p>
          <p className="mb-2">
            광고 제공 과정에서 Google을 포함한 제3자 공급업체는 쿠키(Cookie) 및 광고 식별자 기술을 사용하여, 사용자가 과거에 본 사이트나 다른 웹사이트를 방문한 기록을 기반으로 맞춤형 광고를 게재할 수 있습니다. 
          </p>
          <p>
            사용자는 언제든지 웹 브라우저의 쿠키 설정을 변경하거나, Google의 광고 설정(Ads Settings) 페이지에 방문하여 맞춤형 광고에 쿠키가 사용되지 않도록 설정(Opt-out)할 수 있는 권리를 가집니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">5. 개인정보의 파기 및 데이터 삭제 권리</h2>
          <p>
            사용자는 언제든지 자신의 기기에서 브라우저의 '사이트 데이터(캐시 및 쿠키) 삭제' 기능을 실행하거나 설치된 앱을 완전히 제거함으로써, 기기에 저장된 모든 게임 기록과 식별 데이터를 영구적으로 직접 삭제할 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">6. 아동의 개인정보 보호</h2>
          <p>
            본 서비스는 모든 연령대가 즐길 수 있는 건전한 퍼즐 게임이나, 만 13세 미만 아동의 개인정보를 온라인에서 고의로 수집하거나 추적하지 않습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">7. 개인정보 보호책임자 및 관련 문의</h2>
          <p>
            본 서비스의 이용과 관련하여 개인정보보호에 관한 문의, 건의 사항, 또는 불만 처리가 필요하신 경우 아래의 연락처로 언제든지 문의해 주시기 바랍니다. 최대한 신속하고 성실하게 답변 드리겠습니다.
          </p>
          <p className="mt-2 text-indigo-300 font-semibold">
            이메일 문의: twotheg@gmail.com
          </p>
        </div>
      </section>
    </main>
  );
}
