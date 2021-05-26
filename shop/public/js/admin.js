const deleteProduct = async btn => {
    const productId = btn.parentNode.querySelector('[name=productId]').value;
    const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value;
    const product = btn.closest('article.card.product-item');
    try {
        await fetch(`/admin/product/${productId}`, {
            method: 'DELETE',
            headers: {
                'csrf-token': csrfToken
            }
        });
        product.remove();
    } catch (err) {
        console.log(err);
    }
};
