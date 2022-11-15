taipei-day-trip

# Week-1 
> **Part 1 - 1：將景點資料存放⾄資料庫**  
1. 使用SQLALCHEMY連接MySQL練習ORM相關操作。
2. 使用Migrate套件可以方便更改database，不用刪掉重新建立。

> **Part 1 - 2：開發三支旅遊景點 API**  
> ![image](https://user-images.githubusercontent.com/108926305/201838786-4e439c0c-fbb2-49d0-8893-cee8ce6b3309.png)

1. 取得景點列表(Parameters: Page, keyword)  
URL範例: http://35.79.132.71:3000/api/attractions?page=0  
URL範例: http://35.79.132.71:3000/api/attractions?page=0&keyword=歷史建築 
2. 取得特定景點  
URL範例: http://35.79.132.71:3000/api/attractions/2
3. 取得景點分類列表
URL範例: http://35.79.132.71:3000/api/categories  

> **Part 1 - 3：將網站上線到 AWS EC2**
1. Docker+AWS EC2部屬
