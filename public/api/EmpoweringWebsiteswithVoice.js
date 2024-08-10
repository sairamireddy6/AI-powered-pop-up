let websiteVoice = document.createElement("div");
let shadow = websiteVoice.attachShadow({ mode: 'open' });

shadow.innerHTML = `
    <style>
               /* Scoped CSS styles */
        .website-voice-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background-color: #007bff;
            color: white;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            border: 4px solid transparent;
        }
        .website-voice-container i {
            font-size: 1.5rem;
        }
        .website-voice-container span {
            font-size: 1rem;
            font-family: sans-serif;
        }

        /* Define keyframes for the border animation */
        @keyframes borderAnimation {
            0% {
                border-color: transparent;
            }
            50% {
                border-color: white;
            }
            100% {
                border-color: transparent;
            }
        }

        /* Apply the animation to the container */
        .animate-border {
            animation: borderAnimation 2s infinite;
        }

        /* Styling for the voice element */
        #voiceElement {
            max-height: 15rem;
            max-width: 27rem;
            overflow: auto;
            border-radius: 8px;
        }

        /* Custom scrollbar styles */
        #voiceElement::-webkit-scrollbar {
            width: 3px; /* Width of the scrollbar */
        }

        #voiceElement::-webkit-scrollbar-track {
            background: #f1f1f1; /* Background of the scrollbar track */
            border-radius: 10px;
        }

        #voiceElement::-webkit-scrollbar-thumb {
            background: #3597ff; /* Color of the scrollbar thumb */
            border-radius: 10px;
        }

        #voiceElement::-webkit-scrollbar-thumb:hover {
            background: #0056b3; /* Color of the scrollbar thumb on hover */
        }
    </style>
    <div id="start" class="website-voice-container">
        <span id="voiceElement">
        <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png" 
        style="
    height: 15px;
    width: 19px;
    filter: invert(1);
"
        />
        </span>
    </div>
`;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;


async function postRequest(url, data, options = {}) {
  try {
      const response = await fetch(`http://localhost:3000/api/${url}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              ...options.headers,
          },
          body: JSON.stringify(data),
          ...options,
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
  } catch (error) {
      console.error('Error making POST request:', error);
      throw error;
  }
}

function generateUniqueId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '#';
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// To Send the user Data to the server

let userData = {
  site : location.href,
  uniqueId : generateUniqueId(6),
  commandsUsed : 0
}

if(!localStorage.userData){
  postRequest('allusers',userData).then((response) => {
    localStorage.setItem('userData',JSON.stringify(userData))
  })
}

function insertContent(rawText,ele) {
  const formattedText = rawText
        .replace(/^##\s*(.*)$/gm, '<h2>$1</h2>') // Convert headings
        .replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>') // Convert bold text
        .replace(/^\*\s*(.*)$/gm, '<li>$1</li>') // Convert list items
        .replace(/\n\n/g, '</p><p>') // Convert paragraphs
        .replace(/<p>\s*<li>/g, '<ul><li>') // Fix list opening tag
        .replace(/<\/li>\s*<\/p>/g, '</li></ul>'); // Fix list closing tag

  const contentElement = ele;
  contentElement.innerHTML = formattedText;
}

let lastRespose = ""
    
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  
  // Set some properties
  recognition.continuous = false; // Stop after one result
  recognition.interimResults = false; // Get final results

  // Start recognition when button is clicked
  shadow.getElementById('start').addEventListener('click', () => {
    recognition.start();
  });

  // Handle the result event
  recognition.addEventListener('result', (event) => {
    const transcript = event.results[0][0].transcript;
    shadow.querySelector("#voiceElement").innerHTML = transcript
    shadow.querySelector("#start").classList.add('animate-border');

    console.log("transcript",transcript);

    if(transcript == 'insert in the form text area'){
      let textareaData = document.createElement('div');
      insertContent(lastRespose,textareaData)
      document.querySelector("form textarea").value = textareaData.innerText
    }
    if(transcript.toLowerCase() == 'translate this page into telugu'){
      console.log("Telugu working");
      let userData = JSON.parse(localStorage.userData)
      postRequest('client',{userid:userData.uniqueId, message:"translate below text in to telugu : "+document.body.textContent.replace(/\n/g, '')})
    }
    else{
      let userData = JSON.parse(localStorage.userData)
      postRequest('client',{userid:userData.uniqueId, message:transcript})
      .then(responseData => {
        shadow.querySelector("#start").classList.remove('animate-border');
        lastRespose = responseData.message
        insertContent(responseData.message,shadow.querySelector("#voiceElement"))
      })
      .catch(error => {
          console.error('Request failed:', error);
      });
    }


  });

  // Handle errors
  recognition.addEventListener('error', (event) => {
    console.error('Speech recognition error:', event.error);
  });

  // Handle end of recognition
  recognition.addEventListener('end', () => {
    console.log('Speech recognition service disconnected');
  });

} else {
  console.error('Your browser does not support speech recognition.');
}

document.body.appendChild(websiteVoice);
