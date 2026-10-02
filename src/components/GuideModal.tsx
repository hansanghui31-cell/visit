import React, { useState } from 'react';
import { APPS_SCRIPT_CODE } from '../constants';
import { X, Copy, Check, ExternalLink, AlertTriangle, Lightbulb, ChevronRight, FileCode, CheckCircle2 } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopySuccess: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'steps' | 'structure' | 'code' | 'troubleshoot'>('steps');

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopied(true);
    onCopySuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-amber-200 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-xs">
              📘
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                초보자를 위한 구글 시트 연동 가이드
              </h3>
              <p className="text-xs text-slate-500">
                단 3분 만에 무료로 나만의 구글 스프레드시트 DB를 구축해보세요!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-6 bg-slate-50/50 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('steps')}
            className={`py-3 px-3.5 text-xs md:text-sm font-bold border-b-2 transition shrink-0 ${
              activeTab === 'steps'
                ? 'border-amber-500 text-amber-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            🚀 5단계 연동 방법
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`py-3 px-3.5 text-xs md:text-sm font-bold border-b-2 transition shrink-0 flex items-center gap-1 ${
              activeTab === 'structure'
                ? 'border-amber-500 text-amber-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>📊 시트 구조 안내</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-3.5 text-xs md:text-sm font-bold border-b-2 transition shrink-0 flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-amber-500 text-amber-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Apps Script 코드 복사</span>
          </button>
          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`py-3 px-3.5 text-xs md:text-sm font-bold border-b-2 transition shrink-0 ${
              activeTab === 'troubleshoot'
                ? 'border-amber-500 text-amber-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            💡 문제 해결 / FAQ
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'steps' && (
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800">
                    구글 스프레드시트 생성하기
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    구글 드라이브에서 새 스프레드시트를 생성합니다.{' '}
                    <a
                      href="https://sheets.new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 font-semibold underline inline-flex items-center gap-0.5"
                    >
                      sheets.new 바로가기 <ExternalLink className="w-3 h-3 inline" />
                    </a>
                    <br />
                    (첫 행 헤더는 스크립트가 실행될 때 자동으로 만들어주므로 비워두셔도 됩니다!)
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-200/60 flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-xl bg-orange-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800">
                    확장 프로그램 &gt; Apps Script 열기
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    스프레드시트 상단 메뉴에서 <strong>[확장 프로그램]</strong> &rarr;{' '}
                    <strong>[Apps Script]</strong>를 클릭하여 코드 편집기 창을 엽니다.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-200/60 flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-xl bg-pink-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800">
                      제공된 코드 붙여넣기 및 저장
                    </h4>
                    <button
                      onClick={handleCopyCode}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition inline-flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? '복사됨' : '코드 복사'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    기존의 <code className="bg-white px-1 py-0.5 rounded text-pink-700">myFunction()</code> 코드를 모두 지우고, 본 웹앱의 [Apps Script 코드 복사] 탭에 있는 전체 코드를 붙여넣은 뒤 <strong>Ctrl+S (저장)</strong>를 누릅니다.
                  </p>
                </div>
              </div>

              {/* Step 4: Crucial Settings */}
              <div className="p-4 rounded-2xl bg-amber-100/50 border border-amber-300 flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span>웹 앱으로 배포하기</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-semibold">
                      ★ 가장 중요
                    </span>
                  </h4>
                  <ul className="text-xs text-slate-700 mt-1.5 space-y-1 list-disc list-inside leading-relaxed">
                    <li>Apps Script 우측 상단 <strong>[배포] &gt; [새 배포]</strong> 클릭</li>
                    <li>유형 선택(톱니바퀴 아이콘)에서 <strong>[웹 앱]</strong> 선택</li>
                    <li>설명: <code>방명록 API</code></li>
                    <li>
                      다음 사용자로 실행: <strong>나(내 이메일)</strong>
                    </li>
                    <li>
                      액세스 권한이 있는 사용자:{' '}
                      <span className="bg-amber-200 px-1 py-0.5 rounded font-bold text-amber-900">
                        모든 사용자 (Anyone)
                      </span>{' '}
                      (방문자가 로그인 없이 작성할 수 있게 해줍니다)
                    </li>
                    <li><strong>[배포]</strong> 버튼 클릭 후 구글 계정 권한 승인 완료하기</li>
                  </ul>
                </div>
              </div>

              {/* Step 5 */}
              <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  5
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800">
                    웹 앱 URL 복사 후 연동 설정
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    배포 완료 창에 표시된 <strong>웹 앱 URL</strong>
                    (형식: <code>https://script.google.com/macros/s/.../exec</code>)을 복사하여, 본 웹앱 상단의 <strong>[시트 연동 설정]</strong>에 붙여넣으면 즉시 연동 완료됩니다!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="space-y-5">
              {/* Highlight Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-amber-900 text-sm block mb-1">
                  💡 직접 입력할 필요 없이 자동으로 생성됩니다!
                </span>
                Apps Script 코드가 실행되면 아래와 같은 6개 열(A~F)을 첫 번째 행에 자동으로 생성하고 예쁜 노란색 헤더 스타일까지 적용해 줍니다.
              </div>

              {/* Mock Google Sheet Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>📗 Google 스프레드시트 구조 미리보기</span>
                  <span className="text-[11px] text-slate-400">시트 이름: '방명록' 또는 기본 시트</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-amber-100/90 text-amber-900 font-bold border-b border-amber-200">
                        <th className="py-2.5 px-3 border-r border-amber-200 text-center w-12 text-slate-400 font-mono">
                          #
                        </th>
                        <th className="py-2.5 px-3 border-r border-amber-200">A열: id</th>
                        <th className="py-2.5 px-3 border-r border-amber-200">B열: name</th>
                        <th className="py-2.5 px-3 border-r border-amber-200">C열: message</th>
                        <th className="py-2.5 px-3 border-r border-amber-200">D열: tag</th>
                        <th className="py-2.5 px-3 border-r border-amber-200">E열: emoji</th>
                        <th className="py-2.5 px-3">F열: createdAt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50 font-mono text-[11px] text-slate-600">
                        <td className="py-2.5 px-3 text-center bg-slate-50 text-slate-400 font-semibold border-r border-slate-200">
                          1
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 font-bold text-amber-900">id</td>
                        <td className="py-2.5 px-3 border-r border-slate-100 font-bold text-amber-900">name</td>
                        <td className="py-2.5 px-3 border-r border-slate-100 font-bold text-amber-900">message</td>
                        <td className="py-2.5 px-3 border-r border-slate-100 font-bold text-amber-900">tag</td>
                        <td className="py-2.5 px-3 border-r border-slate-100 font-bold text-amber-900">emoji</td>
                        <td className="py-2.5 px-3 font-bold text-amber-900">createdAt</td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-xs">
                        <td className="py-2.5 px-3 text-center bg-slate-50 text-slate-400 font-mono font-semibold border-r border-slate-200">
                          2
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 font-mono text-slate-500">entry_17277...</td>
                        <td className="py-2.5 px-3 border-r border-slate-100 font-semibold text-slate-800">햇살가득 데이지</td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-slate-700">오늘 하루도 고생 많으셨어요!</td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-orange-700 font-medium">응원</td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center text-sm">🌻</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">2026-10-01T06:00:00.000Z</td>
                      </tr>
                      <tr className="hover:bg-slate-50 text-xs">
                        <td className="py-2.5 px-3 text-center bg-slate-50 text-slate-400 font-mono font-semibold border-r border-slate-200">
                          3
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 font-mono text-slate-500">entry_17278...</td>
                        <td className="py-2.5 px-3 border-r border-slate-100 font-semibold text-slate-800">행운의 네잎클로버</td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-slate-700">배포를 진심으로 축하합니다 🎉</td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-pink-700 font-medium">축하</td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center text-sm">🍀</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">2026-10-01T06:15:30.000Z</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Column Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-amber-500 text-white inline-flex items-center justify-center text-[10px]">A</span>
                    <span>id (고유 식별값)</span>
                  </span>
                  <p className="text-slate-600">등록 시간 기반 고유 ID (예: entry_1727760000000). 데이터 구분을 위해 자동 생성됩니다.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-amber-500 text-white inline-flex items-center justify-center text-[10px]">B</span>
                    <span>name (작성자 닉네임)</span>
                  </span>
                  <p className="text-slate-600">작성자가 입력한 이름. 미입력 시 '익명의 천사'로 자동 저장됩니다.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-amber-500 text-white inline-flex items-center justify-center text-[10px]">C</span>
                    <span>message (응원 한마디)</span>
                  </span>
                  <p className="text-slate-600">본문 메시지 내용. 구글 시트에서 직접 오타를 수정해도 웹앱에 바로 반영됩니다!</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-amber-500 text-white inline-flex items-center justify-center text-[10px]">D</span>
                    <span>tag (카테고리 태그)</span>
                  </span>
                  <p className="text-slate-600">응원, 축하, 힘내요, 감사, 소원, 일상 등의 카테고리 분류 태그입니다.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-amber-500 text-white inline-flex items-center justify-center text-[10px]">E</span>
                    <span>emoji (아바타 이모지)</span>
                  </span>
                  <p className="text-slate-600">작성자가 선택한 프로필 이모지 (예: 🌸, 🍀, 🌻 등).</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-amber-500 text-white inline-flex items-center justify-center text-[10px]">F</span>
                    <span>createdAt (작성 일시)</span>
                  </span>
                  <p className="text-slate-600">표준 ISO 날짜 문자열. 웹앱에서 '방금 전', '5분 전' 등의 친절한 시간으로 변환됩니다.</p>
                </div>
              </div>

              {/* Tips */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <span className="font-bold block">✨ 구글 시트 활용 팁:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  <li><strong>직접 수정 및 삭제</strong>: 시트에서 잘못된 글의 행(Row)을 삭제하거나 메시지를 수정하면 웹앱을 새로고침할 때 그대로 반영됩니다.</li>
                  <li><strong>1행 헤더 보존</strong>: 1행의 영어 컬럼명(<code className="bg-white px-1 rounded">id, name, message...</code>)은 코드가 인식하는 기준이므로 수정하지 마세요.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  아래 코드를 복사하여 Google Apps Script 편집기에 그대로 붙여넣으세요.
                </p>
                <button
                  onClick={handleCopyCode}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition inline-flex items-center gap-1.5 shadow-xs"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? '복사 완료!' : '전체 코드 복사하기'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto max-h-[420px] leading-relaxed select-all">
                  {APPS_SCRIPT_CODE}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'troubleshoot' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-700 space-y-2">
                <h5 className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Q. "액세스 권한" 또는 "Failed to fetch" 오류가 발생해요!</span>
                </h5>
                <p className="leading-relaxed">
                  Apps Script 배포 시 <strong>[액세스 권한이 있는 사용자]</strong>를 반드시{' '}
                  <strong>[모든 사용자(Anyone)]</strong>로 설정하셔야 합니다. '나만' 또는 '조직 내 사용자'로 설정되면 웹앱에서 조회/저장이 거부됩니다.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Q. 코드를 수정한 후 시트에 반영이 안 돼요!</span>
                </h5>
                <p className="leading-relaxed">
                  Google Apps Script 코드를 수정한 뒤에는 반드시 우측 상단의{' '}
                  <strong>[배포] &gt; [배포 관리] &gt; 편집(연필 아이콘) &gt; 버전: [새 버전]</strong>으로 선택하고 [배포]를 다시 눌러주셔야 수정사항이 적용됩니다.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Q. 구글 시트 열(Column) 이름은 어떻게 지정해야 하나요?</span>
                </h5>
                <p className="leading-relaxed">
                  제공해드린 코드는 시트가 비어있을 때 자동으로 <code>id, name, message, tag, emoji, createdAt</code> 6개 헤더를 첫 행에 생성하고 예쁜 노란색 배경까지 입혀줍니다! 별도의 사전 설정 없이 바로 사용 가능합니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            도움이 필요하시면 가이드의 문제 해결 탭을 확인해주세요.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition active:scale-95"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};
