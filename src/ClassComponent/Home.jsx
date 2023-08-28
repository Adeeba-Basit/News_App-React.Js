import React, { Component } from 'react'
import NewsItem from './NewsItem'
import InfiniteScroll from "react-infinite-scroll-component";
// import { findByLabelText } from '@testing-library/react';

export default class Home extends Component {
  constructor() {
    super()
    this.state = {
      articles: [],
      totalResults: 0,
      page: 1
    }
  }
  getInputData = async () => {
    var response = ""
    try {

      if (this.props.search)
         response = await fetch(`https://newsapi.org/v2/everything?sortBy=publishedAt&page=1&q=${this.props.search}&pageSize=20&language=${this.props.language}&apiKey=9d13c61bc729442d8ed72fe97bb8dcf0`)
      else
         response = await fetch(`https://newsapi.org/v2/everything?sortBy=publishedAt&page=1&q=${this.props.q}&pageSize=20&language=${this.props.language}&apiKey=9d13c61bc729442d8ed72fe97bb8dcf0`)
      response = await response.json()
      console.log(response)
      this.setState({
        articles: response.articles,
        totalResults: response.totalResults
      })
    }
    catch (error) {
      // alert("Something Went Wrong")
    }
  }
  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 })
    var response = ""
    try {
      if (this.props.search)
        response = await fetch(`https://newsapi.org/v2/everything?sortBy=publishedAt&page=${this.state.page}&q=${this.props.search}&pageSize=20&language=${this.props.language}&apiKey=9d13c61bc729442d8ed72fe97bb8dcf0`)
      else
        response = await fetch(`https://newsapi.org/v2/everything?sortBy=publishedAt&page=${this.state.page}&q=${this.props.q}&pageSize=20&language=${this.props.language}&apiKey=9d13c61bc729442d8ed72fe97bb8dcf0`)
      response = await response.json()
      console.log(response)
      this.setState({
        articles: response.articles.concat(response.articles)
      })
    }
    catch (error) {
      // alert("Something Went Wrong")
    }
  }
  componentDidMount() {
    this.getInputData()
  }
  componentDidUpdate(old) {
    if (this.props !== old)
      this.getInputData()
    console.log("called", old);
  }
  render() {
    return (
      <div className='container-fluid'>
        <h5 className='background p-2 text-center text-light mt-1'>{this.props.search ? this.props.search : this.props.q} News </h5>
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length < this.state.totalResults}
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
              this.state.articles.map((item, index) => {
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
}
