import { API_URL } from "../../lib/constants";

export async function getServerSideProps() {
    let tours = [];

    try {
        const res1 = await fetch(
            `${API_URL}/api/trip?locale=es&fields=title,sub_title,highlight,price,duration,category,slug,url_brochure`
        );
        const data = await res1.json();

        if (Array.isArray(data)) {
            tours = data.filter((tour) => tour.slug);
        } else {
            console.error("La respuesta no es un array:", data);
        }
    } catch (err) {
        console.error("Error al obtener tours:", err.message);
    }

    return {
        props: {
            tours,
        },
    };
}

export default function ToursTable({ tours }) {
    return (
        <div style={{ padding: "20px" }}>
            <h1>Lista de Tours</h1>
            <table
                border="1"
                cellPadding="8"
                cellSpacing="0"
                style={{ borderCollapse: "collapse", width: "100%" }}
            >
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Sub Title</th>
                        <th>Highlight</th>
                        <th>Price</th>
                        <th>Duration</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Slug</th>
                        <th>Brochure</th>
                    </tr>
                </thead>
                <tbody>
                    {tours.map((tour, idx) => (
                        <tr key={idx}>
                            <td style={cellStyle}>{tour.title}</td>
                            <td style={cellStyle}>{tour.sub_title}</td>
                            <td style={cellStyle}>{tour.highlight}</td>
                            <td style={cellStyle}>{tour.price}</td>
                            <td style={cellStyle}>{tour.duration}</td>
                            <td style={cellStyle}>{tour.category}</td>
                            <td style={cellStyle}>{tour.description}</td>
                            <td style={cellStyle}>{tour.slug}</td>
                            <td style={cellStyle}>{tour.url_brochure}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const cellStyle = {
    maxWidth: "200px",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "normal",
};
