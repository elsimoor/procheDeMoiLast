"use client";

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import moment from 'moment';

const CREATE_RESERVATION_V2 = gql`
  mutation CreateReservationV2($input: CreateReservationV2Input!) {
    createReservationV2(input: $input) {
      id
    }
  }
`;

const CREATE_PRIVATISATION_V2 = gql`
  mutation CreatePrivatisationV2($input: CreatePrivatisationV2Input!) {
    createPrivatisationV2(input: $input) {
      id
    }
  }
`;

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const restaurantId = searchParams.get('restaurantId');
  const customerInfo = { name: "Guest User", email: "guest@example.com", phone: "0000000000" };

  // Details from URL
  const type = searchParams.get('type') || 'standard';
  const date = searchParams.get('date');
  const heure = searchParams.get('heure');
  const personnes = searchParams.get('personnes');
  const emplacement = searchParams.get('emplacement');
  const typePrivatisation = searchParams.get('typePrivatisation');
  const menuGroupe = searchParams.get('menuGroupe');
  const espace = searchParams.get('espace');

  const [createReservation, { loading: reservationLoading }] = useMutation(CREATE_RESERVATION_V2, {
    onCompleted: () => {
      toast.success("Réservation confirmée avec succès !");
      router.push('/'); // Redirect to a success page or home
    },
    onError: (error) => {
      toast.error(`Échec: ${error.message}`);
      console.error(error);
    }
  });

  const [createPrivatisation, { loading: privatisationLoading }] = useMutation(CREATE_PRIVATISATION_V2, {
     onCompleted: () => {
      toast.success("Demande de privatisation envoyée !");
      router.push('/');
    },
    onError: (error) => {
      toast.error(`Échec: ${error.message}`);
      console.error(error);
    }
  });

  const handleConfirm = () => {
    if (!date || !heure || !personnes) {
        toast.error("Détails de réservation manquants.");
        return;
    }

    if (type === 'privatisation') {
      if (!typePrivatisation || !menuGroupe || !espace) {
        toast.error("Détails de privatisation manquants.");
        return;
      }
      createPrivatisation({
        variables: {
          input: {
            restaurantId,
            date,
            heure,
            personnes: parseInt(personnes, 10),
            type: typePrivatisation,
            menu: menuGroupe,
            espace,
            dureeHeures: 4, // Example value, should be part of privatisation option
            source: 'new-ui',
            customerInfo,
          }
        }
      });
    } else {
      createReservation({
        variables: {
          input: {
            restaurantId,
            date,
            heure,
            personnes: parseInt(personnes, 10),
            emplacement: emplacement || '',
            source: 'new-ui',
            customerInfo,
          }
        }
      });
    }
  };

  const isLoading = reservationLoading || privatisationLoading;

  const formattedDate = date ? moment(date).format("dddd, MMMM D") : "N/A";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl">
        <CardHeader>
          <p className="text-sm font-medium text-gray-500">Home / Restaurant / Reservation</p>
          <CardTitle className="text-4xl font-extrabold text-gray-800 tracking-tight mt-2">Confirm your reservation</CardTitle>
        </CardHeader>
        <CardContent className="mt-6 space-y-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-lg">
            <div className="space-y-1"><p className="font-semibold text-gray-500">Date</p><p>{formattedDate}</p></div>
            <div className="space-y-1"><p className="font-semibold text-gray-500">Time</p><p>{heure}</p></div>
            <div className="space-y-1"><p className="font-semibold text-gray-500">Guests</p><p>{personnes}</p></div>
            {type === 'privatisation' ? (
              <>
                <div className="space-y-1"><p className="font-semibold text-gray-500">Menu</p><p>{menuGroupe || 'N/A'}</p></div>
                <div className="space-y-1 md:col-span-2"><p className="font-semibold text-gray-500">Espace</p><p>{espace || 'N/A'}</p></div>
              </>
            ) : (
                 <div className="space-y-1"><p className="font-semibold text-gray-500">Emplacement</p><p>{emplacement || 'Aucun'}</p></div>
            )}
             <div className="space-y-1 md:col-span-2"><p className="font-semibold text-gray-500">Location</p><p>123 Main Street, Anytown</p></div>
          </div>
          <div className="border-t pt-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Payment</h3>
            <p className="text-gray-600">Payment details are not required at this stage.</p>
            <p className="text-4xl font-bold text-right text-gray-900 mt-4">Total: --</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleConfirm} disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full py-7 text-xl font-semibold shadow-lg">
            {isLoading ? 'Confirmation en cours...' : 'Confirm Reservation'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}
