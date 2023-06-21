import React, {useRef, useState} from 'react';
import Common from "../common/Common";
import './scss/ReviewSearch.scss';
import searchIcon from '../../src_assets/search-icon.png';
import {Link, useNavigate} from "react-router-dom";
import {getToken} from "../common/util/login-util";
import {GrPowerReset} from "react-icons/gr";

const ReviewSearch = ({onSearchChange, onSearchKeywordChange}) => {
    const [selectedBtn, setSelectedBtn] = useState('전체');
    const inputVal = useRef();

    //로그인 검증
    const ACCESS_TOKEN = getToken();
    const redirection = useNavigate();
    const loginCheckHandler = (e) =>{
        console.log(`ACCESS_TOKEN = ${ACCESS_TOKEN}`)
        if (ACCESS_TOKEN === '' || ACCESS_TOKEN === null){
            alert('로그인 후 이용가능합니다.')
            e.preventDefault();
            redirection('/login');
            // return;
        }
    }
    const handleInputChange = (e) => {
        const value = e.target.textContent;
        onSearchChange(value);
        setSelectedBtn(value);
        // onClickCurrentPageChange(1);
    }

    //검색엔터
    const searchHandler = (e) => {
        if (e.keyCode===13){
            onSearchKeywordChange(e.target.value);
        }
        if (e.target.value === ''){
            onSearchKeywordChange('');
        }
    }

    //검색버튼
    const submitHandler = () =>{
        const inputValue =  inputVal.current.value;
        onSearchKeywordChange(inputValue);
    }
    //리셋버튼
    const resetHandler = () =>{
        inputVal.current.value='';

        onSearchKeywordChange('');
    }

    return (
        <Common className={'review-search-wrapper'}>
            <ul className={'sort-btn'}>
                <li
                    onClick={handleInputChange}
                    className={selectedBtn === '전체' ? 'selected' : ''}
                >
                    전체
                </li>

                <li
                    onClick={handleInputChange}
                    className={selectedBtn === '평점순' ? 'selected' : ''}
                >
                    평점순
                </li>

                <li
                    onClick={handleInputChange}
                    className={selectedBtn === '조회순' ? 'selected' : ''}
                >
                    조회순
                </li>

            </ul>
            <div className={'search-wrapper'}>
                <img src={searchIcon} alt={'search-icon'} className={'search-icon'}/>
                <input className={'input-btn'} placeholder={'검색창'} name={'search'} onKeyUp={searchHandler} ref={inputVal}></input>
                <button className={'reset-btn'} onClick={resetHandler}><GrPowerReset /></button>
                <button className={'submit-btn'} onClick={submitHandler}>검색</button>
            </div>
            <Link to={'/reviews/write'}>
                <button className={'write-btn'} onClick={loginCheckHandler}>작성하기</button>
            </Link>
        </Common>
    );
};

export default ReviewSearch;