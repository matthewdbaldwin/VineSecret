import React from "react";

const Money = ({ cost }) => {
    if (cost == null) return '$0';
    return <span style={{ fontWeight: 700 }}> ${(cost / 100).toFixed(2)} </span>;
};

export default Money;
