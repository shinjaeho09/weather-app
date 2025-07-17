import React from 'react';
import './App.css';

// OpenWeather API Key를 입력하세요
const API_KEY = 'ba0624796e9e05ca63890adcdd4ea714';

function App() {
  // 입력값을 저장할 state (초기값: 빈 문자열)
  const [city, setCity] = React.useState('');
  // 날씨 정보를 저장할 state (초기값: null)
  const [weather, setWeather] = React.useState(null);
  // 에러 메시지 state 추가
  const [error, setError] = React.useState('');

  // input 값이 바뀔 때마다 city state를 업데이트
  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  // input에서 Enter 키를 눌렀을 때 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 검색 버튼 클릭 시 실행되는 함수
  const handleSearch = async () => {
    if (!city) return; // 입력값이 없으면 아무것도 하지 않음
    try {
      // OpenWeather API 호출 (단위: metric -> 섭씨)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=kr`
      );
      if (!response.ok) {
        // 응답이 실패하면(404 등) 에러 처리
        throw new Error('City not found');
      }
      const data = await response.json();
      // 날씨 정보 state에 저장
      setWeather({
        city: data.name,
        temp: `${Math.round(data.main.temp)}°C`,
        desc: data.weather[0].description,
        icon: data.weather[0].icon, // 아이콘 코드 저장
      });
      setError(''); // 에러 메시지 초기화
    } catch (error) {
      // 잘못된 도시 입력 시 에러 메시지 표시
      setError('도시를 찾을 수 없습니다.');
      setWeather(null);
    }
  };

  return (
    <div className="App">
      {/* 검색 영역을 감싸는 div로 구조 개선 */}
      <div className="weather-search">
        {/* 도시 이름을 입력하는 input */}
        <input
          type="text"
          placeholder="도시 이름을 입력하세요"
          value={city}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="weather-input"
        />
        {/* 검색 버튼 */}
        <button onClick={handleSearch} className="weather-btn">검색</button>
      </div>
      {/* 날씨 정보를 보여주는 영역 */}
      <div className="weather-info">
        {/* 에러 메시지 표시 (빨간 글씨) */}
        {error && <p className="weather-error">{error}</p>}
        {/* 날씨 정보가 있으면 보여주고, 없으면 안내 메시지 */}
        {weather ? (
          <>
            {/* 날씨 아이콘 (온도 위, 크게) */}
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
              alt={weather.desc}
              className="weather-icon"
            />
            <h2>{weather.city}</h2>
            <p>{weather.temp}</p>
            <p>{weather.desc}</p>
          </>
        ) : (
          <p>도시 이름을 입력하고 검색하세요.</p>
        )}
      </div>
    </div>
  );
}

export default App;
