// スクリプトのプロパティを取得
const properties = PropertiesService.getScriptProperties().getProperties()

function getCalender() {
  const calender = CalendarApp.getCalendarById(properties["CALENDER_ID"])

  const now = new Date()
  const today = Utilities.formatDate(now, 'JST', 'yyyy/MM/dd 00:00:00')
  console.log(today)

  const startTime = new Date('1900/01/01 00:00:00');
  const endTime = new Date('2022/04/01 00:00:00');

  let events = calender.getEvents(startTime, endTime)
  for (const event of events) {
    console.log(event.getTitle());
    console.log("[開始]:" + event.getStartTime());
    console.log("[終了]:" + event.getEndTime());
  }
}

const title = 1
const startDate = 2
const endDate = 3
const startTime = 4
const endTime = 5
const description = 6
const allDay = 7
const willSend = 8
const isSent = 9
const willDelete = 10

function registerEvent() {

  const calender = CalendarApp.getCalendarById(properties['CALENDER_ID'])
  const sheet = SpreadsheetApp.openById(properties['SPREAD_SHEET_ID']).getActiveSheet()

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

      
      if (sheet.getRange(row, allDay).getValue === true) {
        // カレンダー登録
        const stDate = new Date(`${sd}`)
        const enDate = new Date(`${ed}`)
        calender.createAllDayEvent(tt, stDate, enDate)
      } else {
        const stDate = new Date(`${sd} ${st}:00`)
        const enDate = new Date(`${ed} ${et}:00`)
        // カレンダー登録
        calender.createEvent(tt, stDate, enDate)
        // 送信成功した場合に送信済みフラグを更新する
        sheet.getRange(row, isSent).setValue(true)
      }
    }
  }
  // イベント登録
  // calender.createEvent(title, startTime, endTime)

}

function deleteEvents() {
  /*  WillDeleteがTrueとなっているイベントを削除する
   *  
   *
   */
  const calender = CalendarApp.getCalendarById(properties['CALENDER_ID'])
  const sheet = SpreadsheetApp.openById(properties['SPREAD_SHEET_ID']).getActiveSheet()

  const lastRow = sheet.getLastRow()

  // 削除対象データを格納する
  const arr = []

  for (let row = 1; row <= lastRow; ++row) {

    // willSend ... 送信準備OKのもの
    // isSent ... 送信済みかどうかのフラグ
    const cond1 = sheet.getRange(row, isSent).getValue() === true
    const cond2 = sheet.getRange(row, willSend).getValue() === true
    const cond3 = sheet.getRange(row, willDelete).getValue() === true
    if (cond1 && cond2 && cond3) {
      // HACK: 変数名見直しをする
      const tt = sheet.getRange(row, title).getValue()
      const sd = sheet.getRange(row, startDate).getValue()
      const st = sheet.getRange(row, startTime).getValue()
      const ed = sheet.getRange(row, endDate).getValue()
      const et = sheet.getRange(row, endTime).getValue()

      const stDate = new Date(`${sd} ${st}:00`)
      const enDate = new Date(`${ed} ${et}:00`)

      console.log("削除対象のデータを取得しました。")
      console.log(`${tt} / ${stDate} / ${enDate}`)
      arr.push([tt, stDate, enDate, row])
    }
  }

  // TODO: 日付はパラメーター設定出来るようにする
  let events = calender.getEvents(new Date("1900/01/01"), new Date("2022/03/29"))

  for (let e in events) {
    console.log(e)
    const title = events[e].getTitle()
    const startTime = events[e].getStartTime()
    const endTime = events[e].getEndTime()

    for (let i in arr) {
      if (title === arr[i][0]
        && +startTime === +arr[i][1]
        && +endTime === +arr[i][2]) {

        console.log("以下イベントを削除します")
        console.log(events[e])
        events[e].deleteEvent()

        // イベント削除に成功したら元の表にfalseを設定
        sheet.getRange(arr[i][3], willDelete).setValue(false);
      }
    }
  }
}
