const menus = document.querySelectorAll(".menus button");
let news = [];
let page = 1;
let total_pages = 0;
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

let searchButton = document.getElementById("search-button");
let url;
//각 함수에서 필요한 URL 만들고
//API 호출 함수를 부른다

const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "m5f6BW17oxCHu7MjZ3KH-gjS5luIVz9JyRxMCzP8jgA",
    });
    url.searchParams.set('page', page);
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다");
      }
      news = data.articles;
      total_pages = data.total_pages;
      page = data.page;
      render();
      pagenation();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("잡힌 에러는", error.message);
    errorRender(error.message);
  }
};

const getLatestNew = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`
  );
  getNews();
};

const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
  );
  getNews();
};

const getNewsByKeyword = async () => {
  //1.검색 키워드 읽어오기
  // 2. url 검색 키워트 붙히기
  //3. 헤더 준비
  //4. url 부르기
  //5. 데이터 가져오기
  //6. 데이터 보여주기

  let keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
  );
  getNews();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((item) => {
      return `<div class="row news">
        <div class="col-lg-4">
          <img class="news-img-size" src="${item.media}" alt="">  
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>${item.summary}</p>
            <div>${item.rights} * ${item.published_date}</div>
        </div>
    </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
    ${message}
  </div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};
//total_page = 3 일 경우
// >> << 구현
// 마지막이나 첫번째에는 << >> 없음
const pagenation = () => {
  let pagenationHTML = ``;
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  if(last > total_pages){
    last = total_pages
  }
  let first = last - 4  <=0 ? 1 : last-4
  
  if(first >= 6){
      pagenationHTML += 
      `<li class="page-item">
            <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
                page - 1
            })">
                <span aria-hidden="true">&lt&lt;</span>
            </a>
        </li>   
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
          page - 1
        })">
          <span aria-hidden="true">&lt;</span>
        </a>
      </li>`;
  }


  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${
      page == i ? "active" : ""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  }

  if(last === total_pages)
   pagenationHTML += `<li class="page-item">
     <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${
       page + 1
    })">
      <span aria-hidden="true">&gt;</span>
    </a>
    </li>`
    `<li class="page-item">
     <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${
       page + 1
    })">
      <span aria-hidden="true">&gt&gt;</span>
    </a>
    </li>`;



   document.querySelector(".pagination").innerHTML = pagenationHTML;
 };

const moveToPage = (pageNum) => {
  //1. 이동하고 싶은 페이지
  page = pageNum;
  //2. 이동하고 싶은 페이지 api 호출
  getNews();
};
searchButton.addEventListener("click", getNewsByKeyword);
getLatestNew();