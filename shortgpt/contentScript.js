// <a href="https://www.flaticon.com/free-icons/turtle" title="turtle icons">Turtle icons created by Freepik - Flaticon</a>
// thanks to free-icons/turtle

const addNewChatBtnSelector = "#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.dark.flex-shrink-0.overflow-x-hidden.bg-gray-900 > div > div > div > nav > a";
const textareSelector = "#prompt-textarea";
const formSelector = "#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.absolute.bottom-0.left-0.w-full.border-t.md\\:border-t-0.dark\\:border-white\\/20.md\\:border-transparent.md\\:dark\\:border-transparent.md\\:bg-vert-light-gradient.bg-white.dark\\:bg-gray-800.md\\:\\!bg-transparent.dark\\:md\\:bg-vert-dark-gradient.pt-2 > form"
const usersChatsSelector = "#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.group.w-full.text-gray-800.dark\\:text-gray-100.border-b.border-black\\/10.dark\\:border-gray-900\\/50.dark\\:bg-gray-800 > div > div.relative.flex.w-\\[calc\\(100\\%-50px\\)\\].flex-col.gap-1.md\\:gap-3.lg\\:w-\\[calc\\(100\\%-115px\\)\\] > div.flex.flex-grow.flex-col.gap-3 > div"
const usersChatTitlesSelector = "#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.dark.flex-shrink-0.overflow-x-hidden.bg-gray-900 > div > div > div > nav > div.flex-col.flex-1.transition-opacity.duration-500.overflow-y-auto.-mr-2 > div > div > span:nth-child(1) > div:nth-child(1) > ol > li:nth-child(6) > a > div"
const titlesOlSelector = "#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.dark.flex-shrink-0.overflow-x-hidden.bg-gray-900 > div > div > div > nav > div.flex-col.flex-1.transition-opacity.duration-500.overflow-y-auto > div > div > span:nth-child(1) > div:nth-child(1) > ol"

// 24kg CO2 per day https://towardsdatascience.com/chatgpts-electricity-consumption-7873483feac4
// 10m prompts a day https://nerdynav.com/chatgpt-statistics/
// 2.4 mg per prompt
// 1.2 saved emissions with shorter 
const CO2perWord = 0.01008403361 // mg per word
const turtlesPerCO2 = 0.15
let co2 = 0
const avgPromtWords = 100


console.log("GreenifyGPT running...")

const cleanUserChats = () => {
  const chats = document.querySelectorAll(usersChatsSelector)
  for (const chat of chats) {
    const oldText = chat.textContent;
    const newText = oldText.replace(" (make answer short)", "")
    chat.textContent = newText
  }
}

const injectOutput = () => {
  try {

    const outputDiv = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.dark.flex-shrink-0.overflow-x-hidden.bg-gray-900 > div > div > div > nav > div.border-t.border-white\\/20.pt-2");

    while (outputDiv.childNodes.length > 3) {
      outputDiv.firstChild.remove();
    }

    const newDiv = document.createElement("div");
    newDiv.id = "shortgpt-output"

    newDiv.innerHTML = `
      <div id="shortgpt-row-1">
        <img id="shortgpt-row-1-img" width=22 height=22 src="https://i.postimg.cc/CdyZkBfT/leaf.png" />
        <p id="shortgpt-row-1-p" >You saved ${co2.toFixed(1)}mg CO2</p>
      </div>
    `

    /*
    `
      <div id="shortgpt-row-1">
        <img id="shortgpt-row-1-img" width=22 height=22 src="https://i.postimg.cc/CdyZkBfT/leaf.png" />
        <p id="shortgpt-row-1-p" >You saved ${co2.toFixed(1)}g CO2</p>
      </div>
      <div id="shortgpt-row-2">
        <img id="shortgpt-row-2-img" width=27 height=27 src="https://i.postimg.cc/3x1S1xys/turtle.png" />
        <p id="shortgpt-row-2-p">Thats about ${(co2 * turtlesPerCO2).toFixed(0)}x turtles</p>
      </div>
    `
    */

    /*
    const image1 = document.createElement("img");
    image1.src = "https://i.postimg.cc/3x1S1xys/turtle.png";
    image1.width = 30
    image1.height = 30
    image1.id = "shortgpt-img"
    newDiv.appendChild(image1);

    const image2 = document.createElement("img");
    image2.src = "https://i.postimg.cc/CdyZkBfT/leaf.png";
    image2.width = 30
    image2.height = 30
    image2.id = "shortgpt-img"
    newDiv.appendChild(image2);

    const paragraph = document.createElement("p");
    paragraph.id = "shortgpt-p"
    paragraph.textContent = "You saved" + " " + co2 + " CO2";
    newDiv.appendChild(paragraph);
    */
    outputDiv.insertAdjacentHTML("afterbegin", newDiv.outerHTML);


  } catch (err) {
    console.log(err)
  } 
  
}

const checkForOutputCO2 = () => {
  setTimeout(() => {
    const aiChats = document.querySelectorAll("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.group.w-full.text-gray-800.dark\\:text-gray-100.border-b.border-black\\/10.dark\\:border-gray-900\\/50.bg-gray-50.dark\\:bg-\\[\\#444654\\] > div > div.relative.flex.w-\\[calc\\(100\\%-50px\\)\\].flex-col.gap-1.md\\:gap-3.lg\\:w-\\[calc\\(100\\%-115px\\)\\] > div.flex.flex-grow.flex-col.gap-3 > div > div")
      const currentAiChat = aiChats[aiChats.length - 1]
      console.log("ADDING AI WORD EMISSIONS")
      const currentAiChatWordsCount = currentAiChat.textContent.split(" ").length
      co2 = (currentAiChatWordsCount * CO2perWord) + co2
  }, 7000)
}



let subscribedForNewMessage = false 

let oldPageTitle = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.text-gray-800.w-full.mx-auto.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100 > h1")
let oldTitlesAmount = document.querySelectorAll("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.dark.flex-shrink-0.overflow-x-hidden.bg-gray-900 > div > div > div > nav > div.flex-col.flex-1.transition-opacity.duration-500.overflow-y-auto.-mr-2 > div > div > span:nth-child(1) > div:nth-child(1) > ol > li:nth-child(2)").length
let oldUrl = window.location.href
oldUrl = oldUrl.slice()

const checkIfPageChanged = () => {
  const newPageTitle = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.text-gray-800.w-full.mx-auto.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100 > h1")
  let newTitlesAmount = document.querySelectorAll("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.dark.flex-shrink-0.overflow-x-hidden.bg-gray-900 > div > div > div > nav > div.flex-col.flex-1.transition-opacity.duration-500.overflow-y-auto.-mr-2 > div > div > span:nth-child(1) > div:nth-child(1) > ol > li:nth-child(2)").length
  const newUrl = window.location.href
  let willUpdate = false

  if (newUrl !== oldUrl || newPageTitle !== oldPageTitle || newTitlesAmount !== oldTitlesAmount) {
    willUpdate = true
  }

  if (willUpdate) {
    oldUrl = newUrl 
    subscribedForNewMessage = false
    oldPageTitle = newPageTitle
    oldTitlesAmount = newTitlesAmount
  }
}

setInterval(() => {
  cleanUserChats()
}, 3)

const getNewText = (old) => {
  const newText = old.replace(" (make answer short)", "") + " (make answer short)"
  console.log("SUCCESS")
  co2 = co2 + (CO2perWord * (newText.split(" ").length))
  checkForOutputCO2()

  return newText 
}

const checkIfUserInChat = () => {
  const addNewChatBtn = document.querySelector(addNewChatBtnSelector);
  const textarea = document.querySelector(textareSelector);
  const form = document.querySelector(formSelector)

  const handleOnFormSubmit = () => {
    textarea.value = getNewText(textarea.value);
  }

  const handleOnEnterSubmit = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && textarea === document.activeElement) {
      console.log("user submitted with enter")
      textarea.value = getNewText(textarea.value);
    }
  }

  if (textarea) {
    injectOutput()

    if (!subscribedForNewMessage) {
      console.log("subscribing...")
      form.addEventListener('submit', handleOnFormSubmit);
      textarea.addEventListener("keydown", handleOnEnterSubmit);
      subscribedForNewMessage = true
    } else {
      console.log("No need to add subscriber")
    }
  } else {
    console.log("You are NOT in chat");
    if (subscribedForNewMessage) {
      console.log("unsubscribing....")
      try {
        form.removeEventListener('submit', handleOnFormSubmit);
        textarea.removeEventListener("keydown", handleOnEnterSubmit);
      } catch (err) {
        
      }
      
      subscribedForNewMessage = false;
    }
  }
};

setInterval(() => {
  checkIfPageChanged()
  checkIfUserInChat()
}, 500)