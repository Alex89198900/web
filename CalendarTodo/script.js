const dateNow = new Date()
const monthNow = dateNow.getMonth()
const yearNow = dateNow.getFullYear()

const addMessage = document.querySelector('.message')
const addButtom = document.querySelector('.add')



const addButtom2 = document.querySelector('.add23')

let showMonth = monthNow
let showYear = yearNow

const temp = new Date(yearNow, monthNow + 1, 0)
const lastDay = temp.getDate()
const tod = document.querySelector('.today')

const calendar = document.querySelector('.ver')
const todo = document.querySelector('.todo__list')
const reloadP = document.querySelector('.reload')
const btnup=document.querySelector('.btn__up')
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

btnup.addEventListener('click',function(){
  document.location.reload()
})
let todoList2 = []

function showTodoList(date) {
  let todoList2 = []

  addButtom.addEventListener('click', function () {
    let newTdo = {
      todo: addMessage.value,
      checked: false,
      important: false,
    }

    todoList2.push(newTdo)
    localStorage.setItem(date, JSON.stringify(todoList2))
    showTodoList(date)
    
  })

  if (localStorage.getItem(date)) {
    todoList2 = JSON.parse(localStorage.getItem(date))
  }
  const calDaysMap = new Map()

  calDaysMap.set(date, todoList2)

  

  clearTodoList()
  const todoListEl = document.querySelector('.todo__list')
  if (!calDaysMap.has(date)) {
    return
  }

  const todoList = calDaysMap.get(date)
  
  let displayM = ''
  const liEl = document.createElement('li')

  todoList.forEach(function (item, i) {
    
    displayM += `
     <li>
     <input type="checkbox" id="item_${i}" ${item.checked ? 'checked' : ''}/>
     <label for="item_${i}" class='${item.important ? 'important' : 'class'}'>${
      item.todo
    }</label>
    
     
     </li>`

     const taskedit= document.createElement('button');
     taskedit.classList.add("edit");
     taskedit.innerHTML="Edit"
     liEl.appendChild(taskedit)

    liEl.innerHTML = displayM

    todoListEl.append(liEl)
  })
  

  liEl.addEventListener('change', function (event) {
    let idInput = event.target.getAttribute('id')
    let forLabel = liEl.querySelector('[for=' + idInput + ']').innerHTML
    todoList.forEach(function (item) {
      if (item.todo === forLabel) {
        item.checked = !item.checked
        localStorage.setItem(date, JSON.stringify(todoList2))
      }
    })
  })

  liEl.addEventListener('contextmenu', function (event) {
    event.preventDefault()

    todoList.forEach(function (item, i) {
      if (item.todo === event.target.innerHTML) {
        if (event.ctrlKey || event.metaKey) {
          todoList.splice(i, 1)
        } else {
          item.important = !item.important
        }

        showTodoList(date)
        localStorage.setItem(date, JSON.stringify(todoList2))

      }
    })
  })
 
}

function clearTodoList() {
  const todoListEl = document.querySelector('.todo__list')
  todoListEl.innerHTML = ''
}

function displayTodoList(mouseClickEvent) {
  const day = mouseClickEvent.target.textContent

  const selectedDate = showMonth + 1 + '/' + day + '/' + showYear

  showTodoList(selectedDate)
}

function createTable() {
  calendar.innerHTML = ''
  let dateToShow = new Date(showYear, showMonth, 1)
  let t = dateToShow.getDay() - 1

  if (t < 0) {
    t = 6
  }

  let a = 0
  while (dateToShow.getMonth() === showMonth) {
    let tr = document.createElement('tr')

    let i = 0
    while (i < 7) {
      let td = document.createElement('td')
      td.addEventListener('click', displayTodoList)
      td.addEventListener('dblclick', function () {
        document.location.reload()
      })

      function isCurrentDay() {
        const dayOfMonthNow = Date.UTC(
          dateNow.getFullYear(),
          dateNow.getMonth(),
          dateNow.getDate() + 1,
        )
        const dayOfMonthShow = Date.UTC(
          dateToShow.getFullYear(),
          dateToShow.getMonth(),
          dateToShow.getDate(),
        )
        return dayOfMonthNow === dayOfMonthShow
      }

      function highlightDay() {
        td.style.background = 'blue'
      }

      if (a == 0) {
        if (i < t) {
          td.textContent = ''
        } else {
          td.textContent = dateToShow.getDate()
          dateToShow.setDate(dateToShow.getDate() + 1)
        }
      } else {
        td.textContent = dateToShow.getDate()
        dateToShow.setDate(dateToShow.getDate() + 1)
      }

      if (isCurrentDay()) {
        highlightDay()
        //showTodoList(showMonth + 1 + '/' + td.textContent + '/' + showYear);
      }

      tr.appendChild(td)
      i++
    }
    calendar.appendChild(tr)
    a++
  }

  document.querySelector('.date h1').innerHTML = months[showMonth]
  document.querySelector('.date p').innerHTML = showYear
}

function changeMonth(value) {
  const newMonth = showMonth + value

  if (newMonth === 12) {
    showMonth = 0
    showYear += 1
  } else if (newMonth === -1) {
    showMonth = 11
    showYear -= 1
  } else {
    showMonth = newMonth
  }
}

function clickNextMonth() {
  changeMonth(1)
  createTable()
}

function clickBackMonth() {
  changeMonth(-1)
  createTable()
}

document.querySelector('.next').addEventListener('click', clickNextMonth)
document.querySelector('.back').addEventListener('click', clickBackMonth)

createTable()
