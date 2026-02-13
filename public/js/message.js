document.addEventListener("DOMContentLoaded", () => {

    let msgInfoEl = document.getElementById("msg-info");
    console.log(msgInfoEl)

    const params = new URLSearchParams(window.location.search);

    const id = +params.get("id");

    fetch(`/message/getmessage?id=${id}`)
        .then(res => {
            if (!res.ok) throw new Error("Network response was not OK");
            return res.json();
        })
        .then(data => {
            buildMessageView(data)
        })
        .catch(err => {
            msgInfoEl.innerHTML = "<p>Failed to load message.</p>";
            console.error(err);
        })
})


function buildMessageView(data) {
    const messageInfo = document.getElementById("msg-info");


    messageInfo.innerHTML = `
        <p><span>Subject:</span> ${data.message_subject}</p>
        <p><span>From:</span> ${data.account_firstname} ${data.account_lastname}</p>
        <h2>Message:</h2>
        <p>${data.message_body}</p>
        <hr>

        <div class="message-btns">
            <a href="/message/inbox/${data.account_id}">Return to Inbox</a>
            <button type="button" id="replyBtn">
                Reply
            </button>
            <button type="button" id="markReadBtn">
                ${data.message_read ? "Mark as Unread" : "Mark as Read"}
            </button>
            <button type="button" id="archiveBtn">
                ${data.message_archive ? "Unarchive Message" : "Archive Message"}
            </button>
            <button type="button" id="deleteBtn">
                Delete Message
            </button>
        </div>
    `;


    document.getElementById("markReadBtn").addEventListener("click", () => {
        toggleUpdateRead(data.message_id);
    });

    document.getElementById("archiveBtn").addEventListener("click", () => {
        toggleArchiveRead(data.message_id);
    });

    document.getElementById("deleteBtn").addEventListener("click", () => {
        deleteMessage(data.message_id, data.account_id);
    });

    

};


async function toggleUpdateRead(id) {
   
    const res = await fetch("/message/update", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id })
    })

    const data = await res.json();

    if (data.success) {
        location.reload();
    } else {
        location.reload();
    }
}

async function toggleArchiveRead(id) {
   
    const res = await fetch("/message/archived", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id })
    })

    const data = await res.json();

    if (data.success) {
        location.reload();
    } else {
        location.reload();
    }
}

async function deleteMessage(id, accountId) {
   
    const res = await fetch("/message/delete", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id })
    })

    const data = await res.json();

    if (data.success) {
        window.location.href = `/message/inbox/${accountId}`;
    } else {
        location.reload();
    }
}