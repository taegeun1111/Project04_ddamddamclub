package kr.co.ddamddam.qna.qnaReply.api;

import kr.co.ddamddam.common.response.ApplicationResponse;
import kr.co.ddamddam.common.response.ResponseMessage;
import kr.co.ddamddam.qna.qnaReply.dto.page.PageDTO;
import kr.co.ddamddam.qna.qnaReply.dto.request.QnaReplyInsertRequestDTO;
import kr.co.ddamddam.qna.qnaReply.dto.response.QnaReplyListPageResponseDTO;
import kr.co.ddamddam.qna.qnaReply.dto.response.QnaReplyListResponseDTO;
import kr.co.ddamddam.qna.qnaReply.service.QnaReplyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static kr.co.ddamddam.common.response.ResponseMessage.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/ddamddam/qna-reply")
public class QnaReplyApiController {

    private final QnaReplyService qnaReplyService;

    /**
     * QNA 댓글 전체보기
     * [GET] /api/ddamddam/qna-reply/{boardIdx}
     * @param boardIdx - 댓글 목록을 확인할 게시글의 index
     * @return - 요청받은 게시글의 댓글 리스트 (과거순)
     */
    @GetMapping("/{boardIdx}")
    public ApplicationResponse<?> getList(
        @PathVariable Long boardIdx
    ) {
        log.info("GET : /qna-reply/{} - 댓글 전체보기", boardIdx);

        List<QnaReplyListResponseDTO> list = qnaReplyService.getList(boardIdx);

        return ApplicationResponse.ok(list);
    }

    /**
     * QNA 댓글 작성
     * @param boardIdx - 댓글을 작성할 게시글의 index
     * @param replyContent - 작성한 댓글 내용
     * @return - 저장 성공시 게시글의 index, 저장 실패시 FAIL
     */
    @PostMapping("/write")
    public ApplicationResponse<?> writeReply(
//            Long userIdx,
            @RequestBody QnaReplyInsertRequestDTO dto
    ) {
        log.info("POST : /qna-reply/write - QNA {}번 게시글에 '{}' 댓글 작성", dto.getBoardIdx(), dto.getReplyContent());

        // TODO : 토큰 방식으로 로그인한 회원의 idx 를 가져와서 Service 파라미터로 넣는 처리 필요
        Long userIdx = 2L;

        ResponseMessage result = qnaReplyService.writeReply(userIdx, dto);

        if (result == FAIL) {
            return ApplicationResponse.error(result);
        }

        return ApplicationResponse.ok(dto.getBoardIdx());
    }

    @DeleteMapping("/delete/{replyIdx}")
    public ApplicationResponse<?> deleteReply(
            @PathVariable Long replyIdx
    ) {
        log.info("DELETE : /qna-reply/delete/{} - 댓글 삭제", replyIdx);

        ResponseMessage result = qnaReplyService.deleteReply(replyIdx);

        if (result == ResponseMessage.FAIL) {
            return ApplicationResponse.error(result);
        }

        return ApplicationResponse.ok(result);
    }
}
