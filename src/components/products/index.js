import React, { Component } from "react";
import ProductItem from "./product_item";

import './products.scss';
import "bootstrap/dist/css/bootstrap.css";

class Products extends Component {
    goToDetails = id => {
        this.props.history.push(`/products/${id}`);
      };
    
      componentDidMount = () => {
        this.props.getAllProducts();
      };
    render() {
        const { products } = this.props;
        const productElements = products.map(product => {
          return <ProductItem key={product.id} {...product} goToDetails={() => this.goToDetails(product.id)} />;
        });
            
        return (
        <div className='container products'>
            <h1 className="m-4">Shop our cupcakes</h1>
            <div className="row mb-3">{productElements}</div>
        </div>
        );
    }
}