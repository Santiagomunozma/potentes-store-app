import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Header } from "./components/header";
import { Navbar } from "./components/navbar";
import { Outlet } from "@tanstack/react-router";
import Footer from "./components/footer";

const AppLayout = () => {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <>
      <AppShell
        header={{ height: 70 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { desktop: true, mobile: !opened },
        }}
        __size=""
        padding="xl"
        style={{
          backgroundColor: "white",
          backgroundImage:
            'url("https://www.transparenttextures.com/patterns/concrete-wall.png")',
          backgroundSize: "auto",
        }}
      >
        <Header opened={opened} toggle={toggle} />
        <Navbar />

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>

        <Footer />
      </AppShell>
    </>
  );
};

export { AppLayout };
