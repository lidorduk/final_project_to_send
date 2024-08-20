const reportWebVitals = onPerfEntry => {//הפרמטר צפוי להיות פונקציה שתשמש לצורך דיווח על מדדי ביצועים
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);// מודדת את השינויים הכוללים בעיצוב הדף שהתרחשו במהלך טעינת הדף
      getFID(onPerfEntry);//מודדת את הזמן שחלף בין קליק ראשון של המשתמש לבין התגובה של הדפדפן
      getFCP(onPerfEntry);// מודדת את הזמן שבו התוכן הראשון נצבע על המסך
      getLCP(onPerfEntry);//מודדת את הזמן שבו התמונה הגדולה ביותר או החלק הגדול ביותר בתוכן נטען לחלוטין על המסך
      getTTFB(onPerfEntry);//מודדת את הזמן שחלף בין בקשת HTTP לבין קבלת התגובה הראשונה מהשרת
    });
  }
};

export default reportWebVitals;
