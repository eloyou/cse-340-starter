async function countUnreadMessages() {
    try {
        const res = await fetch("/message/getmessages")
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        
        const messages = await res.json()

        let num = 0

        messages.forEach(msg => {
            if (msg.message_read == false) {
                num++
            }
        });

        if (num == 0) {
            document.getElementById("count-unread").style.visibility = "hidden";
        } else {
            document.getElementById("count-unread").innerText = `There are ${num} unread ${num > 1 ? "messages" : "message"}.`
        }
    } catch (error) {
        console.error("Error fetching data", error)
    }
}
async function countArchiveMessages() {
    try {
        const res = await fetch("/message/getarchive")
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        
        const messages = await res.json()

        if (messages.length == 0) {
            document.getElementById("archive-link").innerText= `There are no archived messages.`;
        } else {
            document.getElementById("archive-link").innerText = `There are ${messages.length} archived messages.`
        }
    } catch (error) {
        console.error("Error fetching data", error)
    }
}
async function buildInbox() {
    try {
        const res = await fetch("/message/getmessages")
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        
        const messages = await res.json()


        inboxTable(messages);
    
    

    } catch (error) {
        console.error("Error fetching data", error)
    }
    
}



function inboxTable(messages) {
    let template = `
    <thead>
        <tr>
            <th>Received</th>
            <th>Subject</th>
            <th>From</th>
            <th>Read</th>
        </tr>
    </thead>
    <tbody>
`;

    if (messages.length === 0) {
        template += `
        <tr>
            <td colspan="4">No messages to display.</td>
        </tr>
        `
    }

    messages.forEach(msg => {
        template += `
        <tr>
            <td>${new Date(msg.message_created).toLocaleString()}</td>
            <td><a href="/message/content?id=${msg.message_id}">${msg.message_subject}</a></td>
            <td>${msg.account_firstname} ${msg.account_lastname}</td>
            <td>${msg.message_read ? 'Read' : 'Unread'}</td>
        </tr>
        `;
    });

    template += `
    </tbody>
    `;

    document.getElementById("inbox-list").innerHTML = template;
}


function markRead(id) {

  const readBtn = document.getElementById("readBtn")

  readBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("/message/mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      })

      if (!res.ok) throw new Error("Response not ok")

      window.location.reload()

    } catch (err) {
      console.error("Fetch error:", err)
    }
  })
}

function markArchive(id) {

  const archiveBtn = document.getElementById("archiveBtn")
  archiveBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("/message/archive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      })

      if (!res.ok) throw new Error("Response not ok")

      window.location.reload()

    } catch (err) {
      console.error("Fetch error:", err)
    }
  })
}

async function deleteMessage(id) {
    
  const deleteBtn = document.getElementById("deleteBtn")
  deleteBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("/message/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      })

      if (!res.ok) throw new Error("Response not ok")
      const data = await res.json()
      window.location.href = `/message/inbox`

    } catch (err) {
      console.error("Fetch error:", err)
    }
  })
}



async function buttonMsgActions() {

    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")
    
    
    markArchive(id)
    markRead(id)
    deleteMessage(id)
    
}
async function buildArchive() {
    try {
        const res = await fetch("/message/getarchive")
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        
        const messages = await res.json()
        archiveTable(messages)
    } catch (error) {
        console.error("Error fetching data", error)
    }
}
function archiveTable(messages) {
    let template = `
        <thead>
            <tr>
                <th>Received</th>
                <th>Subject</th>
                <th>From</th>
                <th>Read</th>
            </tr>
        </thead>
        <tbody>
    `;

    if (messages.length === 0) {
        template += `
        <tr>
            <td colspan="5">No Archive to display.</td>
        </tr>
        `
    }

    messages.forEach(msg => {
        template += `
        <tr>
            <td>${new Date(msg.message_created).toLocaleString()}</td>
            <td><a href="/message/content?id=${msg.message_id}">${msg.message_subject}</a></td>
            <td>${msg.account_firstname} ${msg.account_lastname}</td>
            <td>${msg.message_read ? 'Read' : 'Unread'}</td>
        </tr>
        `;
    });

    template += `
    </tbody>
    `;

    document.getElementById("archive-list").innerHTML = template;

}


countUnreadMessages()
countArchiveMessages()
buildInbox()
buildArchive()
buttonMsgActions()



