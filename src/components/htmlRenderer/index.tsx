export const HtmlRenderer = ({ children }) => {
    return (
        <div
            // Renderizamos el contenido HTML recibido como hijo
            dangerouslySetInnerHTML={{ __html: children }}
        />
    );
};

export default HtmlRenderer;
