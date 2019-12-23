const shoppingForm = document.querySelector('.shopping')
const list = document.querySelector('.list')

let items = []

function handleSubmit(e) {
  e.preventDefault()
  const name = e.currentTarget.item.value
  const item = {
    name,
    id: Date.now(),
    complete: false,
  }
  items.push(item)
  e.currentTarget.reset()
  list.dispatchEvent(new CustomEvent('itemsUpdated'))
}

function displayItems() {
  const html = items
    .map(item => {
      return `<li class="shopping-item">
        <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}/>
        <span class="item-name">${item.name}</span>
        <button value="${item.id}" aria-label="Remove ${item.name}">&times;</button>
      </li>`
    })
    .join('')

  list.innerHTML = html
}

function mirrorToLocalStorage() {
  localStorage.setItem('items', JSON.stringify(items))
}

function restoreFromLocalStorage() {
  let lsItems = JSON.parse(localStorage.getItem('items'))
  if (lsItems.length) {
    items.push(...lsItems)
    list.dispatchEvent(new CustomEvent('itemsUpdated'))
  }
}

function deleteItem(id) {
  const newItems = items.filter(item => item.id !== id)
  items = newItems
  list.dispatchEvent(new CustomEvent('itemsUpdated'))
}

function markAsComplete(id) {
  const itemRef = items.find(item => item.id === id)
  itemRef.complete = !itemRef.complete
  list.dispatchEvent(new CustomEvent('itemsUpdated'))
}

shoppingForm.addEventListener('submit', handleSubmit)
list.addEventListener('itemsUpdated', displayItems)
list.addEventListener('itemsUpdated', mirrorToLocalStorage)
list.addEventListener('click', function(e) {
  const id = parseInt(e.target.value)
  if (e.target.matches('button')) {
    deleteItem(id)
  } else if (e.target.matches('input[type="checkbox"]')) {
    markAsComplete(id)
  }
})
restoreFromLocalStorage()