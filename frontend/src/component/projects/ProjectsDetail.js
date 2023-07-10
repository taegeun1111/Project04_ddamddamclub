import React, {useEffect, useState} from 'react';
import Common from "../common/Common";
import ProjectsTitle from "./main/ProjectsTitle";
import {PROJECT} from "../common/config/HostConfig";
import {Link, useLocation, useNavigate} from 'react-router-dom';
import './scss/ProjectDetail.scss';
import {getToken, getUserIdx, getUserNickname} from "../common/util/login-util";
import {format} from 'date-fns';
import {httpStateCatcherDelete} from "../common/util/HttpStateCatcherWrite";

const ProjectsDetail = () => {
    const ACCESS_TOKEN = getToken();
    const headerInfo = {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + ACCESS_TOKEN
    }

    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const projectIdx = searchParams.get('projectIdx');
    const [projectDetail, setProjectDetail] = useState([]);
    const [fileUrl, setFileUrl] = useState('');
    const [applyButtonColor, setApplyButtonColor] = useState('');
    const [offerPeriodFormatted, setOfferPeriodFormatted] = useState('');
    const [writeDateFormatted, setWriteDateFormatted] = useState('')
    const handleLikeClick = (projectId) => {
        // 서버에 좋아요 처리를 위한 POST 요청을 보냅니다
        fetch(PROJECT + `/like/${projectId}`, {
            method: 'POST',
            headers: headerInfo
        })
            .then(res => {
                if (res.status === 200) return res.json()
            })
            .then(data => {
                // console.log(data);
                fetchProjectDetail();
            })
            .catch(error => {
                // console.log('Error:', error);
            });
    };


    const fetchProjectDetail = () => {

        fetch(`${PROJECT}/detail/${projectIdx}`, {
            method: 'GET',
            headers: headerInfo
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch project');
                }
                return response.json();
            })
            .then(data => {
                setProjectDetail([data.payload]);
                // console.log("프로젝트 디테일 dto")
                // console.log(` 마감 일자 형식 변경 ${data.payload.offerPeriod}`);

                // date 형식 변환
                const offer = data.payload.offerPeriod;
                const offerPeriodFormatted = format(new Date(offer), 'yy년 MM월 dd일 HH:mm');
                setOfferPeriodFormatted(offerPeriodFormatted);

                const writeDateFormatted = format(new Date(data.payload.projectDate), 'yy년 MM월 dd일 HH:mm');
                setWriteDateFormatted(writeDateFormatted);

                // 내 게시글 신청하기 버튼 색상 변경
                const b_writer = data.payload.boardWriter;
                const userNickname = getUserNickname();
                // console.log(`내 게시글인가용 ? ${b_writer} = ${userNickname}`);

                const isOwner = b_writer === userNickname;
                setApplyButtonColor(isOwner ? 'gray' : '');
            })
            .catch(error => {
                console.error(error);
            });
    };


    const fetchFileImage = async () => {
        const res = await fetch(
            `${PROJECT}/load-s3?projectIdx=${projectIdx}`, {
                method: 'GET',
            });
        if (res.status === 200) {
            const imgUrl = await res.text();
            setFileUrl(imgUrl);
            // console.log(`프로젝트 디테일 - 이미지 : ${imgUrl}`);
        } else {
            // console.log(await res.text())
            setFileUrl(null);
        }
    };


    useEffect(() => {
        fetchProjectDetail();
        fetchFileImage();
    }, []);

    const handleDelete = (id) => {
        // console.log("delete id : " + id);
        if (window.confirm("삭제 하시겠습니까?")) {

            fetch(PROJECT + `/${projectIdx}`, {
                method: 'DELETE',
                headers: headerInfo
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(res.statusMessage);
                    }
                    return res.json()
                })
                .then(res => {
                    setProjectDetail([res.payload]);
                    // console.log(res)
                    // console.log(`response.payload : ${res.payload}`);
                    alert(res.payload);
                    navigate('/projects');
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const handleApply = async () => {
        if (window.confirm('정말로 신청하시겠습니까?')) {
            const res = await fetch(`${PROJECT}/applicant/${projectIdx}`, {
                method: 'PATCH',
                headers: headerInfo,
                body: JSON.stringify({}),
            })
                .then(async res => {
                    if (res.status === 200) {
                        // console.log('신청 성공');
                        // console.log(res.json());
                        fetchProjectDetail();
                        alert('신청이 완료되었습니다');
                    } else {
                        const errorMessage = await res.text();
                        alert(errorMessage);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert(error.text());
                });
        }
    };

    return (

        <>
            <ProjectsTitle/>
            <Common className={'project-detail-wrapper'}>
                {projectDetail.map(de => {
                    return (
                        <section className={'main-text-wrapper'}>
                            <div key={de.boardIdx} className={'main-wrapper'}>

                                <div className={'project-date'}>
                                    <span className={'p-sub-title'}>작성일자</span>
                                    <span className={'sub-content'}>{writeDateFormatted}</span>

                                </div>

                                <div className={'project-title'}>{de.boardTitle}</div>
                                {fileUrl && <img
                                    src={fileUrl}
                                    alt="Project Image" className={'project-img'}
                                />}
                                <section className={'info-detail-container'}>
                                    <div className={'detail-wrapper'}>

                                        {(getUserNickname() === de.boardWriter) && (
                                            <div className={'category'}>
                                                <Link to={`/projects/modify?projectIdx=${projectIdx}`}
                                                      className={'modify-btn'}>
                                                    수정
                                                </Link>
                                                <span className={'delete-btn'}
                                                      onClick={() => handleDelete(projectIdx)}>삭제</span>
                                            </div>
                                        )}

                                        <div className={'category'}>
                                            <span className={'p-sub-title'}>작성자</span>
                                            <span
                                                className={'sub-content'}>{de.boardWriter} ({de.writerPosition})</span>
                                        </div>
                                        <div className={'category'}>
                                            <span className={'p-sub-title'}>프로젝트 타입 : </span>
                                            <span className={'sub-content'}>{de.projectType}</span>
                                        </div>
                                        <div>
                                            <div className={'category'}>
                                                <span className={'p-sub-title'}>FRONT</span>
                                                <span className={'sub-content'}>{de.applicantOfFront}</span>
                                                /
                                                <span className={'sub-content'}>{de.maxFront}</span>
                                            </div>
                                            <div className={'category'}>
                                                <span className={'p-sub-title'}>BACK</span>
                                                <span className={'sub-content'}>{de.applicantOfBack}</span>
                                                /
                                                <span className={'sub-content'}>{de.maxBack}</span>
                                            </div>
                                        </div>

                                        <div className={'category'}>
                                            <span className={'p-sub-title'}>모집 마감 일자</span>
                                            {/*<span className={'sub-content'}>{de.offerPeriod}</span>*/}
                                            <span className={'sub-content'}>{offerPeriodFormatted}</span>
                                        </div>
                                    </div>
                                </section>
                                <section className={'main-content'}>{de.boardContent}</section>

                                <div className={'btn-wrapper'}>
                                    <div className={'like-wrapper'}
                                         onClick={(e) => {
                                             handleLikeClick(projectIdx);
                                         }}
                                    >
                                        <div className={'like-btn'}>♥ {de.likeCount}</div>
                                    </div>

                                    <section className={'apply-wrapper'}>
                                        <div className={'apply-btn'}
                                             style={{backgroundColor: applyButtonColor}} // Apply the button color
                                             onClick={handleApply}>신청하기
                                        </div>
                                    </section>
                                </div>

                            </div>
                        </section>
                    )
                })}
            </Common>
        </>
    );

}

export default ProjectsDetail;