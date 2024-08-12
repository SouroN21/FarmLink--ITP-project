import React, { useEffect, useState } from "react";
import { offerService } from "../../services/offerService";
import  productService  from "../../services/productService";
import { Spin, message, Card, Row, Col } from "antd";

const OfferPreview = () => {
  const [products, setProducts] = useState([]);
  const [offeredProducts, setOfferedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const setProductsData = async () => {
    try {
      setLoading(true);
      const products = await productService.getAllProducts();
      const offers = await offerService.getAllOffers();
      const currentDate = new Date();

      const validOffers = offers.filter((offer) => {
        return new Date(offer.endDate) > currentDate;
      });
      setProducts(products);
      setOfferedProducts(validOffers);
    } catch (error) {
      message.error(`Error while loading data ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProductsData();
  }, []);

  if (loading) {
    return <Spin />;
  }
  return (
    <div style={{ padding: 20 }}>
      <Row gutter={[16, 16]}>
        {products.map((product) => {
          let productOffers = [];
          offeredProducts.forEach((offer) => {
            if (offer.products.length == 0) {
              const discount = {
                discount: offer.discount,
                discountedPrice:
                  parseInt(product.price) -
                  (parseInt(product.price) / 100) * offer.discount,
                coupon: offer.coupon,
              };
              productOffers.push(discount);
            } else if (offer.products.includes(product._id)) {
              const discount = {
                discount: offer.discount,
                discountedPrice:
                  parseInt(product.price) -
                  (parseInt(product.price) / 100) * offer.discount,
                coupon: offer.coupon,
              };
              productOffers.push(discount);
            }
          });
          return (
            <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
              <Card title={product.name} className="product-card">
                <p className="offer-title">Offers & Coupons</p>
                {productOffers.map((offer, index) => (
                  <div className="offer" key={index}>
                    <span className="discount">{`Get ${offer.discount}% off`}</span>
                    {offer.coupon ? (
                      <span className="coupon">{` Coupon code: ${offer.coupon}`}</span>
                    ) : (
                      <span className="no-coupon">{` No coupon required`}</span>
                    )}
                  </div>
                ))}
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default OfferPreview;
