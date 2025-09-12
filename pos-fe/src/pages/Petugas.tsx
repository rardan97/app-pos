import PetugasList from "@/components/petugas/PetugasList";
import { Card } from "@/components/ui/card";



export default function Petugas() {
    return (
        <>
            <Card className="m-9 p-9">
                <PetugasList />
            </Card>
        </>
    );
}
