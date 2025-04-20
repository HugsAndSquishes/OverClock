async function getData() {
    const res = await fetch("https://snowtooth-api-rest.fly.dev");
    return res.json();
}

export default async function Page() {
    const data = await getData();
    return ( 
        <main>
            <h1>Lift Status Info</h1>
            <table>
                <thead>
                    <tr>
                        <th>Lift Name</th>
                        <th>Current Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((lift) => (
                        <tr key={ lift.id }>
                            <td>{ lift.name }</td>
                            <td>{ lift.status }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>{JSON.stringify(data)}</div>
        </main>
    );
}
