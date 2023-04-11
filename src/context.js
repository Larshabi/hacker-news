import React, { useContext, useEffect, useReducer } from 'react'

import {
  SET_LOADING,
  SET_STORIES,
  REMOVE_STORY,
  HANDLE_PAGE,
  HANDLE_SEARCH,
} from './actions'
import reducer from './reducer'

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?'

const initialState = {
  isLoading:true,
  page:0,
  hits:[],
  query:'react',
  nbPages:0
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [state, dispatch]  = useReducer(reducer, initialState)
  const fetchStories = async(url)=>{
    dispatch({type:SET_LOADING})
    try{
      const resp = await fetch(url)
      const data = await resp.json()
      dispatch({type:SET_STORIES, payload:{hits:data.hits,nbPages:data.nbPages}})
    }catch(err){
      console.log(err)
    }
  }
  const removeStory = (id)=>{
    dispatch({type:REMOVE_STORY, payload:id})
  }
  const handleSearch = (query)=>{
    dispatch({type:HANDLE_SEARCH, payload:query})
  }
  const handlePage = (value)=>{
    dispatch({type:HANDLE_PAGE, payload:value})
  }

  useEffect(()=>{
    const newUrl = `${API_ENDPOINT}query=${state.query}&page=${state.page}`
    fetchStories(newUrl)
  },[state.query, state.page])
  return <AppContext.Provider value={{...state, removeStory, handleSearch, handlePage}}>{children}</AppContext.Provider>
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
