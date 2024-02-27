export default function Page({ params }: { params: { postcode: string } }) {
    return (
        <div>
            <p>Postcode: {params.postcode}</p>
        </div>
    );
}
