import React, {useEffect, useState} from 'react';
import {getToken, getUserPosition, isLogin} from '../common/util/login-util';
import {Button, Modal} from 'react-bootstrap';
import {PROJECT} from "../common/config/HostConfig";
import {Link} from "react-router-dom";
import './scss/QuickMatching.scss';
import frontIcon from "../../src_assets/front.png";
import backIcon from "../../src_assets/back-icon.png";
import xIcon from "../../src_assets/x.png";
import {use} from "js-joda";
import {useMediaQuery} from "react-responsive";


const ProjectsQuickMatching = () => {
    // 토큰
    const ACCESS_TOKEN = getToken();
    const headerInfo = {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + ACCESS_TOKEN
    }
    const USER_POSITION = getUserPosition();

    // 퀵 매칭 모달창
    const [quickDetail, setQuickDetail] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState('')
    const [show, setShow] = useState(false);

    // 퀵 매칭 버튼 클릭
    const handleShow = () => {
        setShow(true);
        quickMatchingFetchData();
        setCurrentPage(1); // 페이지를 1로 초기화
    };

    const handleClose = () => {
        setShow(false);
    };

    // 모달 밖 영역 클릭 시 모달 닫기
    const handleOutsideClick = (e) => {
        if (e.target.classList.contains('modal-box')) {
            handleClose();
        }
    };
    // 퀵 매칭 데이터 불러오기
    const quick = `${PROJECT}/quick?position=${USER_POSITION}&page=${currentPage}&size=1`;
    const quickMatchingFetchData = () => {
        fetch(quick, {
            method: 'GET',
            headers: headerInfo
        })
            .then(res => {
                if (res.status === 500) {
                    alert('서버 오류입니다');
                    return;
                }
                return res.json();
            })
            .then(res => {
                if (res) {
                    // console.log(res.payload.projects);
                    setQuickDetail(res.payload.projects);
                    // console.log('page info !!');
                    // console.log(res.payload.pageInfo);
                    setLastPage(res.payload.pageInfo.endPage);
                    // console.log('lastPage : ' + lastPage);
                }
            });
    };
    const presentationScreen = useMediaQuery({
        query: "(max-width: 414px)",
    });

    // d-day 계산
    const CountdownTimer = ({deadline}) => {
        const calculateDday = (deadline) => {
            const now = new Date();
            const endDate = new Date(deadline);
            const remainingTime = endDate - now;

            // 남은 시간 계산
            const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

            return {days, hours, minutes, seconds};
        };

        const [remainingTime, setRemainingTime] = useState(calculateDday(deadline));

        useEffect(() => {
            const timer = setInterval(() => {
                setRemainingTime(calculateDday(deadline));
            }, 1000);

            return () => {
                clearInterval(timer);
            };
        }, [deadline]);

        const {days, hours, minutes, seconds} = remainingTime;

        return (
            <div className={'deadline'}>
                <div className={'timer'}>{days}<span>{presentationScreen ? ' d' : 'Days'}</span></div>
                <div className={'timer'}>{hours}<span>{presentationScreen ? ' h' : 'Hours'}</span></div>
                <div className={'timer'}>{minutes}<span>{presentationScreen ? ' m' : 'Minutes'}</span></div>
                <div className={'timer'}>{seconds}<span>{presentationScreen ? ' S' : 'Seconds'}</span></div>
            </div>
        );
    };

    // 지원자 현황
    const renderApplicantImages = (count, imgSrc, position) => {
        return Array(count)
            .fill()
            .map((_, index) => (
                <img
                    className={'position-img'}
                    src={imgSrc}
                    alt={position}
                    key={index}
                />
            ));
    };

    // 페이지
    const handlePreviousPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    useEffect(() => {
        quickMatchingFetchData()
    }, [currentPage]);

    return (
        <>
            {
                isLogin &&
                <button className="quick-btn" onClick={handleShow}>
                    Quick Matching
                </button>
            }
            <div
                className={show ? 'modal-box show' : 'modal-box'}
                onClick={handleOutsideClick} // 모달 밖 영역 클릭 시 handleOutsideClick 함수 호출
            >
                <div className="modal-container">
                    {quickDetail.map((board, index) => (
                        <React.Fragment key={index}>
                            <div className="modal-contents">
                                <div className="modal-header">
                                    <button className="close" onClick={handleClose}>
                                        <span>&times;</span>
                                    </button>
                                    <h5 className="modal-title">{board.boardTitle}</h5>
                                </div>
                                <div className="modal-body">
                                    <ul>
                                        <CountdownTimer deadline={board.offerPeriod}/>
                                    </ul>
                                    <div className="applicant-box">
                                        <div className={'front-box'}>
                                            <div className={'position-text'}>front</div>
                                            {renderApplicantImages(
                                                board.applicantOfFront,
                                                frontIcon,
                                                'front'
                                            )}
                                            {renderApplicantImages(
                                                board.maxFront - board.applicantOfFront,
                                                xIcon,
                                                'front'
                                            )}
                                        </div>
                                        <div className={'back-box'}>
                                            <div className={'position-text'}>back</div>
                                            {renderApplicantImages(
                                                board.applicantOfBack,
                                                backIcon,
                                                'back'
                                            )}
                                            {renderApplicantImages(
                                                board.maxBack - board.applicantOfBack,
                                                xIcon, 'back'
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <div className="footer-left">
                                        <Link
                                            to={`/projects/detail?projectIdx=${board.boardIdx}`}
                                            className="btn detail-btn"
                                        >
                                            상세보기
                                        </Link>
                                        <div className="like">❤️ {board.likeCount}</div>
                                    </div>

                                    <div className={'project-type'}>{board.projectType}</div>

                                    <div className="footer-right">
                                        {currentPage > 1 && (
                                            <button
                                                className="btn btn-secondary"
                                                onClick={handlePreviousPage}
                                            >
                                                이전
                                            </button>
                                        )}
                                        {currentPage < lastPage
                                            && (
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={handleNextPage}
                                                >
                                                    다음
                                                </button>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    );

};

export default ProjectsQuickMatching;
