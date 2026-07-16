import React, { useState } from 'react';
import './Dashboard.css';
import { 
  MapPin, 
  CloudSun, 
  CalendarDays, 
  User, 
  LogOut, 
  PlayCircle,
  CheckSquare,
  Calendar,
  Coffee,
  Edit3,
  Bell,
  Sparkles,
  Loader2
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Dashboard = () => {
  const [mood, setMood] = useState('');
  const [todo, setTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // AI 상태
  const [aiMessage, setAiMessage] = useState('가장 빛나는 별은 아직 발견되지 않은 별이다. 당장의 어려움이 너의 내일을 결정하지 않도록, 끊임없이 나아가길 응원할게.');
  const [aiAuthor, setAiAuthor] = useState('- 작은 위로의 한 마디 -');
  const [aiBackground, setAiBackground] = useState(''); 

  const handleAiAdvice = async () => {
    if (!mood || !todo) {
      alert("기분과 할 일을 먼저 입력해주세요!");
      return;
    }

    setIsLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === '여기에_발급받은_Gemini_API_키를_입력해주세요') {
        alert(".env 파일에 올바른 VITE_GEMINI_API_KEY를 설정해주세요. (서버 재시작 필요)");
        setIsLoading(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `사용자의 기분은 "${mood}", 오늘 주요 할 일은 "${todo}" 입니다. 
현재 시간 기반의 가상 환경: 맑고 상쾌한 시간대.
이 상황에 완벽히 어울리는:
1. 짧고 강렬한 동기부여 메시지 (message)
2. 메시지에 어울리는 발화자 컨셉명 (author)
3. 이 감정과 상황에 맞는 CSS 그라데이션 배경값 (background)
   (예: radial-gradient(circle at 10% 10%, rgba(200, 100, 255, 0.9) 0%, transparent 40%), linear-gradient(135deg, #a78bfa 0%, #f472b6 100%))

응답은 반드시 아래 JSON 형식으로만 반환해 주세요 (마크다운 없이 순수 JSON):
{
  "message": "...",
  "author": "...",
  "background": "..."
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanText);

      setAiMessage(parsed.message);
      setAiAuthor(`- ${parsed.author} -`);
      if(parsed.background) {
        setAiBackground(parsed.background);
      }
    } catch (error) {
      console.error("AI 생성 중 오류:", error);
      alert("AI 조언을 가져오는 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-wrapper" style={aiBackground ? { background: aiBackground } : {}}>
      {/* Header 영역 */}
      <header className="dashboard-header">
        <div className="header-left">
          <button className="round-card flex-center">
            <MapPin size={16} className="icon-margin" /> 위치: 서울시
          </button>
          <button className="round-card flex-center">
            <CalendarDays size={16} className="icon-margin" /> 2024년 05월 26일 (일요일)
          </button>
          <button className="round-card flex-center">
            <CloudSun size={16} className="icon-margin" /> 23°C 맑음
          </button>
        </div>
        <div className="header-right">
          <button className="round-card primary flex-center">
            <User size={16} className="icon-margin" /> 프로필 설정
          </button>
          <button className="round-card flex-center">
            <LogOut size={16} className="icon-margin" /> 로그아웃
          </button>
        </div>
      </header>

      {/* Main 영역 */}
      <main className="dashboard-main">
        {/* Section 1: Article 영역 */}
        <section className="dashboard-section section-1">
          <article className="article-box">
            <div className="card gradient-card main-card time-card">
              <h2 className="time-text">오전 02:40</h2>
            </div>
            <div className="card secondary-card quote-card">
              <div className="quote-icon">“</div>
              <p className={aiBackground ? "quote-text ai-generated-quote" : "quote-text"}>
                {aiMessage}
              </p>
              <p className="quote-author">{aiAuthor}</p>
            </div>
          </article>
          
          <article className="article-box timer-article">
            <div className="card gradient-card main-card timer-card">
              <div className="timer-header">
                <span className="timer-title">FOCUS TIMER</span>
              </div>
              <div className="timer-display">
                <h2 className="time-text">25:00</h2>
                <PlayCircle size={40} className="play-icon" />
              </div>
            </div>
            <div className="card secondary-card goal-card flex-row-between">
              <span className="goal-text">하루 목표 달성 스탬프</span>
              <div className="goal-tag">0 / 3</div>
            </div>
          </article>
        </section>

        {/* Section 2 */}
        <section className="dashboard-section section-2">
          <div className="section-header">
            <div className="round-card tag-card">오늘의 주요 메뉴</div>
          </div>
          <div className="card full-card menu-card">
            <button className="menu-item">
              <CheckSquare size={24} />
              <span>할 일</span>
            </button>
            <div className="menu-divider"></div>
            <button className="menu-item">
              <Calendar size={24} />
              <span>미팅</span>
            </button>
            <div className="menu-divider"></div>
            <button className="menu-item">
              <Coffee size={24} />
              <span>휴식</span>
            </button>
          </div>
        </section>

        {/* Section 3: AI 동적 폼 (기존 메모장/알림 영역 대체) */}
        <section className="dashboard-section section-3">
          <div className="card gradient-card full-card medium flex-column ai-input-card">
            <div className="card-title-row">
              <Sparkles size={20} />
              <h3>AI 데일리 셋업</h3>
            </div>
            <p className="card-desc">오늘의 기분과 할 일을 입력하면, AI가 당신만을 위한 대시보드를 완성해 줍니다.</p>
            
            <div className="input-group">
              <label>오늘의 기분은 어떤가요?</label>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="예: 조금 피곤하지만 의욕이 넘침!" 
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label>오늘 가장 중요한 할 일은?</label>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="예: 리액트 대시보드 UI 개발 마무리하기" 
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
              />
            </div>

            <button 
              className="ai-button" 
              onClick={handleAiAdvice}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 size={18} className="spinner" /> : <Sparkles size={18} />}
              {isLoading ? "AI가 영감을 고민하는 중..." : "AI에게 조언과 테마 받기"}
            </button>
          </div>
          
          <div className="card full-card tall flex-column">
             <div className="card-title-row">
              <Bell size={20} />
              <h3>시스템 업데이트 알림</h3>
            </div>
            <p className="card-desc">이번 주 업데이트된 시스템 점검 일정을 확인해 주세요.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
