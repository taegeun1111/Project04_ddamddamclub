import React, {useState} from 'react'
import Common from "../../common/Common";
import searchIcon from "../../../src_assets/search-icon.png";
import '../scss/ProjectSearch.scss';
import {Link, useNavigate} from "react-router-dom";
import {PROJECT} from "../../common/config/HostConfig";
import {isLogin} from "../../common/util/login-util";
import ProjectsQuickMatching from "../ProjectsQuickMatching";
import {useMediaQuery} from "react-responsive";

const ProjectsSearch = () => {
  const [searchText, setSearchText] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    setSearchText(inputText);
    // console.log(inputText);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleSearchClick = () => {
    fetch(`${PROJECT}?keyword=${searchText}`, {
      method: 'GET'
    })
        .then(res => {
          if (res.status === 200) return res.json()
        })
        .then(data => {
          // console.log(data.projects);
          setSearchList(data.projects);
          // console.log(searchList);

          // 검색 결과 페이지로 이동
          navigate(`/projects?page=1&keyword=${searchText}`);

        });

  }
  const presentationScreen = useMediaQuery({
    query: "(max-width: 414px)",
  });

  return (
      <Common className={'project-search-wrapper'}>
        <div className={'search-wrapper'}>
          <img src={searchIcon} alt={'search-icon'} className={'search-icon'}/>
          <input className={'input-search'}
                 placeholder={'검색창'}
                 name={'search'}
                 onChange={handleInputChange}
                 onKeyPress={handleKeyPress}
          ></input>
        </div>

        {!presentationScreen &&
        <div>
          <div className={'search-btn'}
               onClick={handleSearchClick}
               style={{cursor: 'pointer'}}
          >search
          </div>
        </div>
        }

        {isLogin() &&
            <ProjectsQuickMatching />
        }

      </Common>
  )
}

export default ProjectsSearch