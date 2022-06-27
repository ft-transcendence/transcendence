export default function CustomPage() {
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Create your custom page here</h2>
        <p> I used React router to set up the route system and create a SPA</p>
        <p>
            I followed&nbsp;
            <a href="https://reactrouter.com/docs/en/v6/getting-started/tutorial" title="Got to React Router tutorial">this</a>
            &nbsp;tutorial.
        </p>
        <p> Create a <b>customPage.tsx</b> file inside the routes folder</p>
        <p> Add a <b>new route</b> to <b>index.tsx</b>: <br></br>
            <pre>{`import CustomPage from "./routes/customPage"`}</pre>
            <b>Import the function</b> to the file: <br></br>
            <pre>{`<Route path="custom-page" element={<CustomPage />} ></Route>`}</pre>
        </p>
        <p> Add a <b>new link</b> to <b>app.tsx</b> : <br></br>
            <pre>{`<Link to="/custom-page">Custom page</Link>`}</pre>
        </p>
        <p> There you go ! You can access your page via its URL.</p>
        <p> There is no obligation to add the link to the app.tsx, because either way, you'll be able<br></br>
            to access it from /custom-page.
        </p>
      </main>
    );
  }