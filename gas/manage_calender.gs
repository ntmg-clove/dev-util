// スクリプトのプロパティを取得
const properties = PropertiesService.getScriptProperties().getProperties()

function getCalender() {
  const calender = CalendarApp.getCalendarById(properties["CALENDER_ID"])

  const now = new Date()
  const today = Utilities.formatDate(now, 'JST', 'yyyy/MM/dd 00:00:00')
  console.log(today)

  const startTime = new Date(today);
  const endTime = new Date('2022/03/01 00:00:00');

  let events = calender.getEvents(startTime, endTime)
  for (const event of events) {
    console.log(event.getTitle());
    console.log("[開始]:" + event.getStartTime());
    console.log("[終了]:" + event.getEndTime());
  }
  // getProperties("CALENDER_ID")

}


function registerEvent() {

  const calender = CalendarApp.getCalendarById(properties['CALENDER_ID'])
  const sheet = SpreadsheetApp.openById(properties['SPREAD_SHEET_ID']).getActiveSheet()

  const title = 1
  const startDate = 2
  const endDate = 3
  const startTime = 4
  const endTime = 5
  const description = 6
  const allDay = 7
  const willSend = 8
  const isSent = 9
  const lastRow = sheet.getLastRow()

  for (let row = 1; row <= lastRow; ++row) {

    // willSend ... 送信準備OKのもの
    // isSent ... 送信済みかどうかのフラグ
    if (sheet.getRange(row, isSent).getValue() === false &&
      sheet.getRange(row, willSend).getValue() === true) {

      const tt = sheet.getRange(row, title).getValue()
      const sd = sheet.getRange(row, startDate).getValue()
      const st = sheet.getRange(row, startTime).getValue()
      const ed = sheet.getRange(row, endDate).getValue()
      const et = sheet.getRange(row, endTime).getValue()

      const stDate = new Date(`${sd} ${st}:00`)
      const enDate = new Date(`${ed} ${et}:00`)

      if (sheet.getRange(row, allDay).getValue !== true) {
        // カレンダー登録
        calender.createEvent(tt, stDate, enDate)
        // 送信成功した場合に送信済みフラグを更新する
        sheet.getRange(row, isSent).setValue(true)
      }
    }
  }

}

function moveSentRows(){
  const calender = CalendarApp.getCalendarById(properties['CALENDER_ID'])
  const sheet = SpreadsheetApp.openById(properties['SPREAD_SHEET_ID']).getActiveSheet()

  

}

