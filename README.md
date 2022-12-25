taipei-day-trip

# Week-1

> **Part 1 - 1：將景點資料存放⾄資料庫**

1. 使用 SQLALCHEMY 連接 MySQL 練習 ORM 相關操作。
2. 使用 Migrate 套件可以方便更改 database，不用刪掉重新建立。

> **Part 1 - 2：開發三支旅遊景點 API**  
> ![image](https://user-images.githubusercontent.com/108926305/201838786-4e439c0c-fbb2-49d0-8893-cee8ce6b3309.png)

1. 取得景點列表(Parameters: Page, keyword)  
   URL 範例: http://35.79.132.71:3000/api/attractions?page=0  
   URL 範例: http://35.79.132.71:3000/api/attractions?page=0&keyword=歷史建築
2. 取得特定景點  
   URL 範例: http://35.79.132.71:3000/api/attractions/2
3. 取得景點分類列表
   URL 範例: http://35.79.132.71:3000/api/categories

> **Part 1 - 3：將網站上線到 AWS EC2**

1. Docker+AWS EC2 部屬

# Nginx+Uwsgi+SSL

> **Nginx+Uwsgi**

1. 之前做過一次實作了，所以相對來說問題不大，但更複雜的設定還要學習。
2. 這次遇到的是 Uwsgi 不會抓我的.env 環境變數，所以我要另外在 docker-compose.yml 中的 flask container 設定環境。

```
flask:
  env_file: flask/api/.env
```

> **SSL**

1. 去 no-ip 申請了一個免費的 Domain。
2. 本來以為會很簡單，但加上 nginx+uwsgi+docker+ec2 後，我頭很痛，又不想在伺服器裝其他的東西，後來直接用人家的 docker image 來解決。

# Week-2

> **Part 2 - 1：完成 RWD 靜態⾴⾯**

1. 請按照 Figma 設計稿中的⾸⾴設計，完成 RWD 的靜態版⾯。
2. 過程中，發現設計稿可以參考，但不要照抄上面的 CSS，會很痛苦，我幾乎是重新刻了一次。
3. 我未來一定會盡量不要用 abosoluted 來固定一堆元件，要做 RWD 時會很痛苦。
   ![image](https://user-images.githubusercontent.com/108926305/203489275-97d8445d-eb3d-4216-9002-0a9f69d61dea.png)

> **Part 2 - 2：串接景點 API，取得並展⽰第⼀⾴的景點資訊**

1. 串上禮拜做的 API

> **Part 2 - 3：完成⾃動載入後續⾴⾯的功能**

1. 這個比較有挑戰性，我使用 IntersectionObserver 來實作，但中途遇到一個問題就是，我有時候重新整理後，SCROLL 會跑到最底下導致觸發下一頁的載入。
2. 後來用了 IntersectionObserver 本身的 isIntersecting 和 time 參數來控制。
3. API 被瞬間連續呼叫狀況倒是沒有發生，async await 是好朋友!!

> **Part 2 - 4：完成關鍵字搜尋功能**
> **Part 2 - 5：完成景點分類關鍵字填入功能**

1. 比較沒有遇到特殊的狀況，只有程式碼稍微想一下，盡量共用，
2. 過幾天程式碼應該會持續優化可讀性和精簡化。
