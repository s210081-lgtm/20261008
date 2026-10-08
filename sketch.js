// ===== 全域變數宣告 =====
// 題目資料庫陣列
let questions = [];
// 目前正在進行的題目索引（從 0 開始）
let currentQuestionIndex = 0;
// 紀錄使用者答對的總題數
let score = 0;
// 紀錄使用者選了哪一個選項（-1 表示尚未選擇）
let selectedOption = -1;
// 是否已經回答目前這題（用於控制動畫與鎖定選項）
let isAnswered = false;
// 動畫用的時間變數
let animTime = 0;

// 下一題按鈕的座標與尺寸（動態計算）
let nextBtnX, nextBtnY, nextBtnW, nextBtnH;

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 設定文字對齊方式為居中
  textAlign(CENTER, CENTER);
  
  // 初始化 5 道 p5.js 程式設計基礎測驗題目
  questions = [
    {
      question: "1. 在 p5.js 中，設定畫布大小的指令是什麼？",
      options: ["A. size()", "B. createCanvas()", "C. setCanvas()", "D. windowSize()"],
      correct: 1 // 正確答案索引：B
    },
    {
      question: "2. 想要更改圖形的填滿顏色，應該使用哪一個函式？",
      options: ["A. stroke()", "B. color()", "C. fill()", "D. background()"],
      correct: 2 // 正確答案索引：C
    },
    {
      question: "3. 哪一個函式會在 p5.js 程式啟動時「只執行一次」？",
      options: ["A. setup()", "B. draw()", "C. start()", "D. loop()"],
      correct: 0 // 正確答案索引：A
    },
    {
      question: "4. 如何在畫布上繪製一個圓形或橢圓形？",
      options: ["A. rect()", "B. line()", "C. circle()", "D. ellipse()"],
      correct: 3 // 正確答案索引：D
    },
    {
      question: "5. 在 draw() 函式中，不斷設定什麼指令可以清除上一幀的畫面？",
      options: ["A. clearAll()", "B. background()", "C. refresh()", "D. clean()"],
      correct: 1 // 正確答案索引：B
    }
  ];
}

function draw() {
  // 設定畫布背景色為柔和淡灰色
  background(245, 247, 250);
  
  // 更新動畫時間計數器
  animTime += 0.08;

  // 判斷測驗是否已經完成所有題目
  if (currentQuestionIndex < questions.length) {
    // 繪製當前測驗題目與選項（響應式版）
    drawQuiz();
  } else {
    // 繪製最終結算成績畫面（響應式版）
    drawResultScreen();
  }
}

// 繪製測驗畫面（響應式佈局）
function drawQuiz() {
  let q = questions[currentQuestionIndex];

  // 1. 判斷是否為手機豎屏 (Mobile Portrait) 模式
  let isMobilePortrait = width < 600;

  // 2. 動態設定響應式字體大小與間距
  let titleFontSize = constrain(width * 0.025, 18, 32);     // 題目字體
  let progressFontSize = constrain(width * 0.015, 14, 20);  // 進度字體
  let optionFontSize = constrain(width * 0.018, 14, 22);    // 選項字體

  // 3. 繪製頂部進度與題目文字
  fill(80);
  textSize(progressFontSize);
  text(`第 ${currentQuestionIndex + 1} 題 / 共 ${questions.length} 題`, width / 2, height * 0.1);

  fill(30);
  textSize(titleFontSize);
  textStyle(BOLD);
  // 限制題目文字最大寬度，避免在寬螢幕或小螢幕超出畫面
  rectMode(CENTER);
  text(q.question, width / 2, height * 0.2, width * 0.85, height * 0.15);
  textStyle(NORMAL);

  // 4. 動態計算 4 個選項按鈕的尺寸與位置（依螢幕寬高響應）
  let optW = isMobilePortrait ? width * 0.88 : min(width * 0.55, 650); 
  let optH = constrain(height * 0.07, 45, 65);                       
  let startY = height * 0.35;                                        
  let gap = constrain(height * 0.025, 10, 22);                        

  // 繪製 4 個選項按鈕
  for (let i = 0; i < q.options.length; i++) {
    let x = width / 2;
    let y = startY + i * (optH + gap);

    // 預設選項背景顏色（白色）
    let bgColor = color(255);
    let textColor = color(50);

    // 如果使用者已經點擊回答該題
    if (isAnswered) {
      if (selectedOption === q.correct) {
        // --- 答對的情況 ---
        if (i === q.correct) {
          bgColor = color('#A2D2FF'); // 答對顯示亮藍色背景
        }
      } else {
        // --- 答錯的情況 ---
        if (i === q.correct) {
          // 正確答案：背景設為 #FFC8DD，上下跳動
          bgColor = color('#FFC8DD');
          let jumpOffsetY = sin(animTime * 2) * (optH * 0.2); 
          y += jumpOffsetY;
        } else if (i === selectedOption) {
          // 使用者選錯的選項：背景設為 #BDEOFE，左右震動
          bgColor = color('#BDE0FE');
          let shakeOffsetX = sin(animTime * 4) * (optW * 0.02); 
          x += shakeOffsetX;
        }
      }
    }

    // 繪製選項外框與背景矩形
    stroke(210);
    strokeWeight(1.5);
    fill(bgColor);
    rectMode(CENTER);
    rect(x, y, optW, optH, 12); // 12 為圓角半徑

    // 繪製選項文字
    noStroke();
    fill(textColor);
    textSize(optionFontSize);
    text(q.options[i], x, y);
  }

  // 5. 如果已回答問題，顯示響應式「下一題」按鈕
  if (isAnswered) {
    nextBtnW = constrain(width * 0.3, 140, 220);
    nextBtnH = constrain(height * 0.065, 45, 55);
    nextBtnX = width / 2;
    nextBtnY = startY + 4 * (optH + gap) + 15; // 自動定位在最後一個選項下方

    // 繪製下一題按鈕
    stroke(0, 30);
    fill(76, 175, 80); // 綠色按鈕
    rect(nextBtnX, nextBtnY, nextBtnW, nextBtnH, 25);

    fill(255);
    noStroke();
    textSize(constrain(optionFontSize * 1.1, 16, 22));
    textStyle(BOLD);
    let btnText = (currentQuestionIndex === questions.length - 1) ? "查看結果" : "下一題";
    text(btnText, nextBtnX, nextBtnY);
    textStyle(NORMAL);
  }
}

// 繪製最終結果結算畫面（響應式）
function drawResultScreen() {
  let titleSize = constrain(width * 0.04, 24, 42);
  let textSizeSub = constrain(width * 0.022, 16, 26);
  let scoreSize = constrain(width * 0.06, 36, 64);

  fill(40);
  textSize(titleSize);
  textStyle(BOLD);
  text("測驗結束！", width / 2, height * 0.35);

  textSize(textSizeSub);
  textStyle(NORMAL);
  text(`你在 ${questions.length} 道題目中，一共答對了：`, width / 2, height * 0.48);

  // 顯示得分
  fill('#E63946');
  textSize(scoreSize);
  textStyle(BOLD);
  text(`${score} 題`, width / 2, height * 0.62);
  textStyle(NORMAL);
}

// 通用點擊處理邏輯（支援電腦滑鼠點擊與手機觸控）
function handleInput(inputX, inputY) {
  // 如果已經過完所有題目，點擊不執行任何操作
  if (currentQuestionIndex >= questions.length) return;

  let isMobilePortrait = width < 600;
  let optW = isMobilePortrait ? width * 0.88 : min(width * 0.55, 650);
  let optH = constrain(height * 0.07, 45, 65);
  let startY = height * 0.35;
  let gap = constrain(height * 0.025, 10, 22);

  // 情況 A：尚未回答，偵測是否點擊了某個選項
  if (!isAnswered) {
    for (let i = 0; i < 4; i++) {
      let x = width / 2;
      let y = startY + i * (optH + gap);

      // 判斷觸控/點擊位置是否在選項矩形範圍內
      if (
        inputX > x - optW / 2 &&
        inputX < x + optW / 2 &&
        inputY > y - optH / 2 &&
        inputY < y + optH / 2
      ) {
        selectedOption = i;
        isAnswered = true; // 標記為已回答

        // 判斷是否答對，答對則累加分數
        if (selectedOption === questions[currentQuestionIndex].correct) {
          score++;
        }
        break;
      }
    }
  } 
  // 情況 B：已經回答，偵測是否點擊了「下一題」按鈕
  else {
    if (
      inputX > nextBtnX - nextBtnW / 2 &&
      inputX < nextBtnX + nextBtnW / 2 &&
      inputY > nextBtnY - nextBtnH / 2 &&
      inputY < nextBtnY + nextBtnH / 2
    ) {
      // 重設狀態並進入下一題
      currentQuestionIndex++;
      isAnswered = false;
      selectedOption = -1;
    }
  }
}

// 滑鼠點擊事件監聽
function mousePressed() {
  handleInput(mouseX, mouseY);
}

// 觸控螢幕點擊事件監聽（優化手機體驗，防止雙擊縮放）
function touchStarted() {
  handleInput(touches[0]?.x || mouseX, touches[0]?.y || mouseY);
  return false; // 阻止手機預設滾動行為
}

// 當瀏覽器視窗大小改變或手機旋轉螢幕時，動態重設畫布尺寸
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}