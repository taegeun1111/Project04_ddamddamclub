package kr.co.ddamddam.qna.qnaBoard.repository;

import kr.co.ddamddam.qna.qnaBoard.entity.Qna;
import kr.co.ddamddam.qna.qnaBoard.repository.QnaRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

@SpringBootTest
@Rollback(false)
class QnaRepositoryTest {

    @Autowired
    private QnaRepository qnaRepository;

    @Test
    @DisplayName("QNA 게시글 더미데이터 50개 생성")
    void InsertBulk() {

        for (int i = 11; i <= 50; i++) {

            Qna qna = Qna.builder()
                    .qnaTitle("Qna Title " + i)
                    .qnaContent("Qna Content " + i)
                    .qnaWriter("Writer " + i)
                    .build();

            qnaRepository.save(qna);
        }
    }

    @Test
    @DisplayName("QNA 게시글 더미데이터 10개 생성")
    void InsertBulk2() {

        for (int i = 51; i <= 60; i++) {

            Qna qna = Qna.builder()
                    .qnaTitle("큐앤에이큐앤에이큐앤에이큐앤큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이" + i)
                    .qnaContent("큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이큐앤에이" + i)
                    .qnaWriter("Writer " + i)
                    .build();

            qnaRepository.save(qna);
        }
    }

}