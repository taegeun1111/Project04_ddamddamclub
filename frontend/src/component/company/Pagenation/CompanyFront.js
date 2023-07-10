import React, {useEffect, useState} from 'react';
import {COMPANY, REVIEW} from "../../common/config/HostConfig";
import {Link, useNavigate} from "react-router-dom";
import {RxCalendar} from "react-icons/rx"
import {Spinner} from 'reactstrap';
import {useMediaQuery} from "react-responsive";

const CompanyTotal = ({searchKeyword, searchValue, searchCareer}) => {
    const [companyList, setCompanyList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [getFetch, setGetFetch] = useState(true);
    const [finalPage, setFinalPage] = useState(1);
    const [searchResult, setSearchResult] = useState(false);
    //워크넷 링크 상태관리
    const [goWorknet, setGoWorknet] = useState([]);

    useEffect(() => {
        setCompanyList([]); // 기존 리스트 초기화
        setPage(1); // 페이지 번호 초기화
        setFinalPage(1); // 마지막 페이지 초기화
        setGoWorknet([]); // 워크넷 링크 상태 초기화
    }, [searchKeyword, searchValue, searchCareer]);

    const presentationScreen = useMediaQuery({
        query: "(max-width: 414px)",
    });

    useEffect(() => {
        if (getFetch) {
            fetchData(page);
        }

        if (finalPage === 0) {
            setSearchResult(true);
            setIsLoading(false)
            window.removeEventListener('scroll', handleScroll);
            return;
        }
    }, [page, searchKeyword, searchValue, searchCareer, getFetch,finalPage]);

    useEffect(() => {
        // 스크롤 이벤트 리스너 등록
        window.addEventListener('scroll', handleScroll);

        return () => {
            // 컴포넌트 언마운트 시 스크롤 이벤트 리스너 제거
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const fetchData = async (page) => {
        // window.removeEventListener('scroll', handleScroll);

        const res = await fetch(
            `${COMPANY}/searchFront?keyword=${searchKeyword}&page=${page}&size=10&career=${searchCareer}`,
            {
                method: 'GET',
                headers: {'content-type': 'application/json'}
            });

        if (res.status === 500) {
            alert('잠시 후 다시 접속해주세요.[서버오류]');
            return;
        }
        const result = await res.json();

        //마지막 페이지 계산해서 로딩 막기
        const totalCount = result.pageInfo.totalCount;
        const totalPage = Math.ceil(totalCount / 10);
        setFinalPage(totalPage);
        // console.log(`totalPage:`, totalPage)

        if (page !== 1 && page === finalPage) {
            setGetFetch(false)
            window.removeEventListener('scroll', handleScroll);
            return;
        }

        const companyLists = result.companyList

        //list가공
        const modifyCompanyList = companyLists.map((list) => {
            let endDate = list.companyEnddate;
            if (list.companyEnddate.includes('채용시까지')) {
                endDate = endDate.split("채용시까지")[1].trim();
            }
            const formattedEndDate = convertToEndDate(endDate);

            let modifyLocation = list.companyArea.split(" ");
            let setModifyLocation = modifyLocation[0] + " " + modifyLocation[1];

            return {...list, companyEnddate: endDate, dDay: formattedEndDate, companyArea: setModifyLocation}
        });

        setGoWorknet((prevGoWorknet) => [...prevGoWorknet, ...new Array(companyLists.length).fill(false)]);
        setCompanyList((prevCompanyList) => [...prevCompanyList, ...modifyCompanyList]);
        setIsLoading(false)
        setGetFetch(true)
    }

    let throttleTimer = null;
    const handleScroll = (e) => {
        if (getFetch) {
            if (throttleTimer !== null) return;

            throttleTimer = setTimeout(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const documentHeight = document.documentElement.scrollHeight;
                if (scrollTop + windowHeight >= documentHeight - 200 && !isLoading && page <= finalPage) {
                    setPage((prevPage) => prevPage + 1);
                }
                throttleTimer = null;
            }, 1000)
            setIsLoading(true);

        }
    }

    //d-day계산
    const convertToEndDate = (endDate) => {
        const currentYear = new Date().getFullYear();
        const [endYear, endMonth, endDay] = endDate.split('-');

        //년도에 4자리로 만들기
        const formattedEndYear = currentYear - (currentYear % 100) + parseInt(endYear);
        // const formattedEndYear = `20${endYear}`;

        //yyyy-mm-dd
        const formattedEndDate = new Date(`${formattedEndYear}-${endMonth}-${endDay}`);

        const startDate = new Date();
        const timeDiff = formattedEndDate.getTime() - startDate.getTime();
        const dateDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const formattedDdayDate = `D-${dateDiff}`

        return formattedDdayDate;
    }

    const showLinkHandler = (index, companyName) => {
        const updatedGoWorknet = goWorknet.map((item, i) => (i === index ? true : false));
        setGoWorknet(updatedGoWorknet);
    }
    const hiddenLinkHandler = (index) => {
        setGoWorknet(new Array(goWorknet.length).fill(false));
    }
    return (
        <>
            {!presentationScreen &&
                <section className={'sort-wrapper'}>
                    <span className={'sort-dDay'}>D-day</span>
                    <span className={'sort-career'}>경력</span>
                    <span className={'sort-companyName'}>회사명</span>
                    <span className={'sort-title'}>채용내용</span>
                    <span className={'sort-date'}>날짜</span>
                </section>
            }
            {companyList.map((company, index) => (

                <section
                    key={`${company.companyIdx}-${index}`}
                    className={'company-list'}
                    onMouseEnter={() => showLinkHandler(index)}
                    onMouseLeave={() => hiddenLinkHandler(index)}
                >
                    {!presentationScreen ?
                        <>
                            <div className={'d-day'}>{company.dDay}</div>
                            <div className={'company-career'}>{company.companyCareer}</div>
                        </>
                        :
                        <div className={'company-mobile'}>
                            <div className={'d-day'}>{company.dDay}</div>
                            <div className={'company-career'}>{company.companyCareer}</div>
                        </div>
                    }
                    <div className={'companyName'}>{company.companyName}</div>
                    <section className={'title-wrapper'}>
                        <div className={'title'}>{company.companyTitle}</div>

                        <div className={'info-wrapper'}>
                            <div className={'info-salary-text'}>
                                <span className={'info-title'}>급여</span>
                                <span className={'info-content'}>{company.companySal}</span>
                            </div>
                            <div className={'info-location-text'}>
                                <span className={'info-title'}>위치</span>
                                <span className={'info-content'}>{company.companyArea}</span>
                            </div>
                        </div>
                    </section>

                    <div className={'date-wrapper'}>
                        <RxCalendar className={'date-icon'}/>
                        <span className={'date'}>{company.companyDate} ~ {company.companyEnddate}</span>
                    </div>
                    {goWorknet[index] &&
                        <button onClick={() => window.open(`${company.companyUrl}`, '_blank')}
                                className={'go-worknet'}>
                            클릭시 워크넷 채용정보 페이지로 이동합니다.
                        </button>
                    }

                </section>


            ))}

            {/*{isLoading && page !== finalPage && finalPage!==0 &&*/}
            {/*    <div className={'grow-wrapper'}>*/}
            {/*        <Spinner type={"grow"}></Spinner>*/}
            {/*        <Spinner type={"grow"}></Spinner>*/}
            {/*        <Spinner type={"grow"}></Spinner>*/}
            {/*    </div>*/}
            {/*}*/}
            {/*{searchResult && !isLoading &&*/}
            {/*    <div className={'no-search-result'}>마지막 페이지 입니다.</div>*/}
            {/*}*/}
        </>
    );
};

export default CompanyTotal;
