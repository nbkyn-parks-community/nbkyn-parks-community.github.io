import React from "react";

export default ({children}) => (
  <div className="text">
    {children && children?.map(child  => (
        <section className="js-section" data-zoom-middle={1}>
          {child}
        </section>
    ))}
</div>
);
