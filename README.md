# jc-accelon3
將笈成中醫資料庫轉換成 Accelon3 格式

## 製作步驟
      到笈成 git 下載所有書並放到 jc/book 
      node gen  // 生成 xml 文本
      編輯  xml/jc2022.lst 以改變書序，可加 ＜類＞ 標籤。
      執行 accelon3 indexer.exe 按 Add File ，選 jc2022.lst
      按build，等 5~10 分鐘，建成 jc2022.adb，複製到accelon3所在目錄。

      文字檔一律使用  UTF 16 Little Endian With BOM  ( node.js ucs2 格式)

## 製作分庫 (以中藥為例)

     複製 xml\jc2022.lst 到  xml\jc-medicine.lst 
     lst 第一行是標籤設定，可沿用 jicheng.xml ，或創立新的
     如果不需要 ＜類＞標籤　可去除，
     複製jicheng.xml 為 jc-medicine.xml 並設為 jc-medicine.lst 第一行。

## 已知問題

* 笈成沒有照原書分行，合併為一段，gen.js 超過 40個中文字，踫到句號即折行。可能破壞文氣。
* 去除所有未處理的HTML tag。
* 底本、底線只保留了標記，顯示未作特別處理

## 版權聲明

本轉換程式以 Creative Common Zero （拋棄著作權）釋出，任何人都可以自由使用（商業行為亦可），唯由於本軟件造成的損害概不負責。