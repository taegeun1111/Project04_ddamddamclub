import React from 'react';
import {RxDoubleArrowLeft, RxDoubleArrowRight} from 'react-icons/rx'
import './PageNation.scss'
const PageNation = ({pageNation, currentPageHandler, clickCurrentPage}) => {
    const pageAmount = () => {
        // console.log(`pageNation : `, pageNation);
        // console.log(`currentPageHandler : `, currentPageHandler)
        // console.log(`clickCurrentPage : `, clickCurrentPage)

        const pageList = [];

        if (pageNation.currentPage !== 1 && pageNation.totalCount !== 0) {
            pageList.push(
                <li className="page-item" onClick={() => currentPageHandler(1)}>
                    <div className="page-link start"><RxDoubleArrowLeft/></div>
                </li>)
        }
        if (pageNation.prev) {
            pageList.push(
                <li className="page-item" onClick={() => currentPageHandler(pageNation.startPage - 1)}>
                    <div className="page-link prev">prev</div>
                </li>
            )
        }
        for (let i = pageNation.startPage; i <= pageNation.endPage; i++) {
            pageList.push(
                // <li data-page-num="${i}" className="page-item" key={i}>
                <li className={`page-item ${i === clickCurrentPage ? 'active' : ''}`}
                    key={i}
                    onClick={() => currentPageHandler(i)}>
                    <div className={`page-link`}
                         >{i}</div>
                </li>
            )
        }

        if (pageNation.next) {
            pageList.push(
                <li className="page-item" onClick={() => currentPageHandler(pageNation.endPage + 1)}>
                    <div className="page-link next">next</div>
                </li>
            )
        }
        // const finalPage = Math.ceil(PageNation.endPage)
        const finalPage = Math.ceil(pageNation.totalCount/10);
        // console.log(`Math.floor((pageNation.totalCount) / 10) + 1 : `,Math.floor((pageNation.totalCount) / 10) + 1)
        if (pageNation.currentPage !== finalPage && pageNation.totalCount !== 0) {
            pageList.push(
                <li className="page-item" onClick={() => currentPageHandler(Math.ceil((pageNation.totalCount) / 10))}>
                    <div className="page-link end"
                         >
                        <RxDoubleArrowRight />
                    </div>
                </li>
            )
        }

        return pageList;
    }


    return (
        <ul className={'pagination-wrapper'}>
            {pageAmount()}
        </ul>
    );
};

export default PageNation;