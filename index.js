const fs = require('fs');
const crypto = require('crypto');



toJSON = () => {
  const text = fs.readFileSync('./file.strings', 'utf-8');


  const result = {};

  // פיצול הטקסט לשורות
  const lines = text.split('\n');

  // עבור כל שורה בטקסט
  for (const line of lines) {
    // אם השורה אינה ריקה
    if (line.trim() !== '') {
      // פיצול השורה למפתח וערך
      const [key, value] = line.split('=');
      const fixedValue = value.replace(/[";]/g, '');
      const fixedKey = key.replace(/"/g, '');
      // הוספת המפתח והערך לאובייקט התוצאה
      result[fixedKey.trim()] = fixedValue.trim();
    }
  }

  // המרת המערך למחרוזת JSON
  const jsonResult = JSON.stringify(result, null, 2);

  // כתיבת התוצאה לקובץ
  fs.writeFileSync('./output.json', jsonResult, 'utf-8');

  console.log('המרה הושלמה בהצלחה!');
}



fromJSON = () => {
  const jsonString = fs.readFileSync('./output.json', 'utf-8');

  // המרת המחרוזת המכילה את ה-JSON לאובייקט
  const jsonData = JSON.parse(jsonString);

  // מערך שבו נאחסן את התוצאה
  const result = [];

  // עבור כל מאפיין באובייקט ה-JSON
  for (const key in jsonData) {
    if (jsonData.hasOwnProperty(key)) {
      // יצירת שורת טקסט עם המאפיין והערך המתאים
      const line = `"${key}" = "${jsonData[key]}";`;

      // הוספת השורה למערך התוצאה
      result.push(line);
    }
  }

  // המרת מערך התוצאה למחרוזת והוספת יישורים
  const outputString = result.map(line => '  ' + line).join('\n');
// חישוב ערך ה-hash לשם הקובץ
const hash = crypto.createHash('md5').update(outputString).digest('hex');

// שם הקובץ החדש עם ה-hash
const outputFileName = `baba.${hash}.strings`;
  // כתיבת התוצאה לקובץ
  fs.writeFileSync(outputFileName, outputString, 'utf-8');

  console.log('המרה הושלמה בהצלחה!');
}



setInterval(() => {
  toJSON()
  fromJSON()
}, 2000)