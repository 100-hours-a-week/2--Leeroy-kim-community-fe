const url = window.location.href;
const boardNumber = url.substring(url.lastIndexOf('/') + 1);
const boardInfoUrl = `http://localhost:5050/api/boards/${boardNumber}`;
const boardCommentUrl = `http://localhost:5050/api/boards/${boardNumber}/comments`;
let removeCommentId; //댓글 삭제시 댓글 번호 저장

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { data: userInfo } = await axios.get(userInfoUrl);
        await loadBoardInfo(userInfo);
        await loadComments(userInfo);
    } catch (e) {
        handleError(e);
    }
});

//NOTE:게시글 상세 조회
const loadBoardInfo = async userInfo => {
    const { data: boardInfo } = await axios.get(boardInfoUrl);
    const {
        board_id,
        title,
        profile_img,
        nickname,
        board_date,
        content_img,
        content,
        like_count,
        view_count,
        comment_count,
        user_id,
    } = boardInfo.data;

    document.querySelector('#title').innerText = title;
    document.querySelector('#writerProfile').src = profile_img;
    document.querySelector('#nickname').innerText = nickname;
    document.querySelector('#board_date').innerText = board_date;
    if (content_img) {
        document.querySelector('#contentImg').src = content_img;
        document.querySelector('#contentImg').style.display = 'block';
    }
    document.querySelector('#content').innerText = content;
    document.querySelector('#likeCount').innerText = like_count;
    document.querySelector('#viewCount').innerText = view_count;
    document.querySelector('#commentCount').innerText = comment_count;
    document.querySelector('#board-edit-btn').onclick = () => {
        location.href = `/board/edit/${board_id}`;
    };

    //NOTE:게시글과 로그인한 유저가 다를시 버튼 안보이게 처리함
    const editBoardBtn = document.querySelector('.edit-board-btn');
    if (user_id != userInfo.data.user_id) {
        editBoardBtn.style.display = 'none';
    }
};

//NOTE:댓글 조회
const loadComments = async userInfo => {
    const { data: commentInfo } = await axios.get(boardCommentUrl);

    //NOTE:댓글이 없을시 종료
    if (!commentInfo.data || commentInfo.data.length === 0) return;

    const container = document.querySelector('.sub-content');

    container.innerHTML = '';
    commentInfo.data.forEach(
        ({
            comment_id,
            profile_img,
            nickname,
            comment_date,
            comment,
            user_id,
        }) => {
            const isUserComment = user_id == userInfo.data.user_id;

            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.id = `comment-${comment_id}`;
            commentElement.innerHTML = `
            <div class="comment-info">
                <div class="comment-title">
                    <img style="width: 36px; height: 36px; border-radius: 50%; margin-right: 10px;" src="${profile_img}">
                    <span style="margin-right: 24px;">${nickname}</span>
                    <span>${comment_date}</span>
                </div>
                <div class="comment-content" style="white-space: pre-wrap;">${comment}</div>
            </div>
            <div class="comment-btn" ${!isUserComment ? 'style="display:none;"' : 'style="display:flex;"'}>
                <button class="edit-comment" data-id="${comment_id}">수정</button>
                <button class="remove-comment" data-id="${comment_id}" style="margin-left: 8px;">삭제</button>
            </div>
        `;
            container.appendChild(commentElement);
        },
    );

    //NOTE: 댓글 수정 & 삭제 이벤트
    container.addEventListener('click', ({ target }) => {
        if (target.classList.contains('edit-comment')) {
            handleEditComment(target.dataset.id);
        } else if (target.classList.contains('remove-comment')) {
            removeCommentId = target.dataset.id;
            document.querySelector('.comment-modal-container').style.display =
                'flex';
        }
    });

    //NOTE: 댓글 삭제 여부 모달창
    document
        .querySelector('.modal-btn4')
        .addEventListener('click', async () => {
            await deleteComment(removeCommentId);
        });

    document.querySelector('.modal-btn3').addEventListener('click', () => {
        document.querySelector('.comment-modal-container').style.display =
            'none';
    });
};

//NOTE: 댓글 수정
const handleEditComment = commentId => {
    const commentElement = document.querySelector(`#comment-${commentId}`);
    const commentContent =
        commentElement.querySelector('.comment-content').innerText;
    const inputText = document.querySelector('#input-comment');
    const addCommentBtn = document.querySelector('#add-comment');

    inputText.value = commentContent;
    addCommentBtn.textContent = '댓글 수정';
    addCommentBtn.dataset.editId = commentId;
};

//NOTE: 댓글 작성 & 수정
document.querySelector('#add-comment').addEventListener('click', async () => {
    const inputText = document.querySelector('#input-comment');
    const comment = inputText.value.trim();
    const addCommentBtn = document.querySelector('#add-comment');
    const editCommentId = addCommentBtn.dataset.editId;

    if (!comment) return alert('댓글 내용을 입력해주세요!');

    try {
        //NOTE: 댓글 수정
        if (editCommentId) {
            const rseponse = await axios.patch(
                `${boardCommentUrl}/${editCommentId}`,
                { comment },
            );
            if (rseponse.status == 201) {
                alert('댓글 수정 완료!');
                location.reload();
            }
        } else {
            //NOTE: 댓글 작성
            const response = await axios.post(boardCommentUrl, { comment });
            if (response.status == 201) {
                alert('댓글 작성 완료!');
                location.reload();
            }
        }
    } catch (e) {
        handleError(e);
    }
});

//NOTE: 댓글 삭제 요청
const deleteComment = async commentId => {
    try {
        const response = await axios.delete(`${boardCommentUrl}/${commentId}`);
        if (response.status == 201) {
            alert('댓글 삭제 완료!');
            location.reload();
        }
    } catch (e) {
        handleError(e);
    }
};

//NOTE: 게시글 삭제 요청
document.querySelector('.modal-btn2').addEventListener('click', async () => {
    try {
        const response = await axios.delete(boardInfoUrl);

        if (response.status == 201) {
            alert('게시물 삭제 완료!');
            location.href = '/main';
        }
    } catch (e) {
        handleEditComment(e);
    }
});

const handleError = e => {
    const status = e.response?.status;
    if (status == 404) {
        alert('데이터를 찾을 수 없습니다!');
    } else {
        console.error(e);
    }
};