import React, { useState,useEffect } from 'react'
import NewsItem from './NewsItem'
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home (props) {
  let [articles,setArticles] = useState([])
  let [totalResults,setToatlResults] = useState(0)
  let [page,setPage] = useState(1)
  async function getInputData () {
    var response = ""
    try {

      if (props.search)
         response = await fetch(`https://newsapi.org/v2/everything?sortBy=publishedAt&page=1&q=${props.search}&pageSize=20&language=${props.language}&apiKey=9d13c61bc729442d8ed72fe97bb8dcf0`)
      else
         response = await fetch(`https://newsapi.org/v2/everything?sortBy=publishedAt&page=1&q=${props.q}&pageSize=20&language=${props.language}&apiKey=9d13c61bc729442d8ed72fe97bb8dcf0`)
      response = await response.json()
      setArticles(response.articles)
      setToatlResults(response.totalResults)
    }  
    catch (error) {
      // alert("Something Went Wrong")
    }
  }
  var fetchMoreData = async () => {
    setPage(page+1)
    var response = ""
    try {
      if (props.search)
        response = await fetch(`https://newsapi.org/v2/everything?sortBy=publishedAt&page=${page}&q=${props.search}&pageSize=20&language=${props.language}&apiKey=9d13c61bc729442d8ed72fe97bb8dcf0`)
      else
        response = await fetch(`https://newsapi.org/v2/everything?sortBy=publishedAt&page=${page}&q=${props.q}&pageSize=20&language=${props.language}&apiKey=9d13c61bc729442d8ed72fe97bb8dcf0`)
      response = await response.json()
      console.log(response)
       setArticles(articles.concat(response.articles))
    }
    catch (error) {
      // alert("Something Went Wrong")
    }
  }
  useEffect(()=>{
    getInputData()
  },[props])
    return (
      <div className='container-fluid'>
        <h5 className='background p-2 text-center text-light mt-1'>{props.search ? props.search : props.q} News </h5>
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length < totalResults}
          loader={
            <div className='d-flex justify-content-center'>
              <div className="spinner-border my-5" role="status">
                <span className="sr-only"></span>
              </div>
            </div>
          }
        >
          <div className='row'>
            {
              articles.map((item, index) => {
                return <NewsItem
                  key={index}
                  title={item.title.slice(0, 80) + "..."}
                  description={item.description}
                  pic={item.urlToImage}
                  url={item.url}
                  source={item.source.name}
                  date={item.publishedAt}
                />
              })
            }
          </div>
        </InfiniteScroll>
      </div>
    )
  }
