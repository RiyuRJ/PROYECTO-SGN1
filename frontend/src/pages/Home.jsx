import './Home.css';

import background from '../assets/leaf.jpg';

import Layout from '../components/Layout';

function Home() {

    return (

        <Layout>

            <div
                className="home"
                style={{
                    backgroundImage:
                        `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${background})`
                }}
            >

                <section className="hero">

                    <div className="hero-left">

                        <h1>
                            Gestiona tu
                            <br />
                            negocio
                            <br />
                            de forma
                            <br />
                            inteligente.
                        </h1>

                        <p>
                            Plataforma empresarial basada en microservicios,
                            diseñada para escalar usuarios, inventario y operaciones
                            de manera moderna y segura.
                        </p>

                    </div>

                    <div className="hero-right">

                        <div className="dashboard-card">

                            <h2>Dashboard SGN</h2>

                            <div className="card-content">

                                <div className="mini-card">
                                    Usuarios activos
                                    <span>128</span>
                                </div>

                                <div className="mini-card">
                                    Productos
                                    <span>560</span>
                                </div>

                                <div className="mini-card">
                                    Ventas
                                    <span>$12.400</span>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            </div>

        </Layout>

    );
}

export default Home;