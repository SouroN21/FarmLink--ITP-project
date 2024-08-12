import React, { useEffect } from 'react'
import useRedirectLoggedOutUser from '../../customHook/useRedirectLoggedOutUser'
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../redux/features/auth/authSlice';
import { getProducts } from '../../redux/features/product/ProductSlice';
import ProductList from '../../components/product/productList/ProductList';
import ProductSummary from '../../components/product/productSummary/ProductSummary';
import GlobalStyles from '../../GlobalStyles';

const Dashboard = () => {
 // useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn)

  const { products, isLoading, isError, message } = useSelector((state => state.product))


  useEffect(() => {
    if (isLoggedIn === true) {
      dispatch(getProducts())
    }




    if (isError) {
      console.log(message);
    }

  }, [isLoggedIn, isError, message, dispatch])



  return (
    <div>
      <h2>Dashboard</h2>
      <GlobalStyles />
      <ProductSummary products={products} />
      <ProductList
        products={products}
        isLoading={isLoading}
      />
       <div>
      
  
    </div>
    </div>
  )
}

export default Dashboard